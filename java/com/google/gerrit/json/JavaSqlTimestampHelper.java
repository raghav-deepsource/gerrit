// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.gerrit.json;

import com.google.common.base.Splitter;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

/** Utility to parse Timestamp from a string. */
public class JavaSqlTimestampHelper {

  private static final Splitter TIMESTAMP_SPLITTER = Splitter.on(" ");
  private static final Splitter DATE_SPLITTER = Splitter.on("-");
  private static final Splitter TIME_SPLITTER = Splitter.on(":");

  /**
   * Parse a string into a timestamp.
   *
   * <p>Note that {@link Timestamp}s have no timezone, so the result is relative to the UTC epoch.
   *
   * <p>Supports the format {@code yyyy-MM-dd[ HH:mm:ss[.SSS][ Z]]} where {@code Z} is a 4-digit
   * offset with sign, e.g. {@code -0500}.
   *
   * @param s input string.
   * @return resulting timestamp.
   */
  public static Timestamp parseTimestamp(String s) {
    List<String> components = TIMESTAMP_SPLITTER.splitToList(s);
    if (components.size() < 1 || components.size() > 3) {
      throw new IllegalArgumentException("Expected date and optional time: " + s);
    }
    String date = components.get(0);
    String time = components.size() >= 2 ? components.get(1) : null;
    int off = components.size() == 3 ? parseTimeZone(components.get(2)) : 0;
    List<String> dSplit = DATE_SPLITTER.splitToList(date);
    if (dSplit.size() != 3) {
      throw new IllegalArgumentException("Invalid date format: " + date);
    }
    int yy, mm, dd;
    try {
      yy = Integer.parseInt(dSplit.get(0));
      mm = Integer.parseInt(dSplit.get(1)) - 1;
      dd = Integer.parseInt(dSplit.get(2));
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("Invalid date format: " + date, e);
    }

    int hh, mi, ss, ns;
    if (time != null) {
      int p = time.indexOf('.');
      String t;
      double f;
      try {
        if (p >= 0) {
          t = time.substring(0, p);
          f = Double.parseDouble("0." + time.substring(p + 1));
        } else {
          t = time;
          f = 0;
        }
        List<String> tSplit = TIME_SPLITTER.splitToList(t);
        if (tSplit.size() != 3) {
          throw new IllegalArgumentException("Invalid time format: " + time);
        }
        hh = Integer.parseInt(tSplit.get(0));
        mi = Integer.parseInt(tSplit.get(1));
        ss = Integer.parseInt(tSplit.get(2));
        ns = (int) Math.round(f * 1e9);
      } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid time format: " + time, e);
      }
    } else {
      hh = 0;
      mi = 0;
      ss = 0;
      ns = 0;
    }
    Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.set(yy, mm, dd, hh, mi, ss);
    Timestamp result = new Timestamp(calendar.toInstant().toEpochMilli() - off);
    result.setNanos(ns);
    return result;
  }

  private static int parseTimeZone(String s) {
    if (s.length() != 5 || (s.charAt(0) != '-' && s.charAt(0) != '+')) {
      throw new IllegalArgumentException("Invalid time zone: " + s);
    }
    for (int i = 1; i < s.length(); i++) {
      if (s.charAt(i) < '0' || s.charAt(i) > '9') {
        throw new IllegalArgumentException("Invalid time zone: " + s);
      }
    }
    int off =
        (s.charAt(0) == '-' ? -1 : 1)
            * 60
            * 1000
            * ((60 * Integer.parseInt(s.substring(1, 3))) + Integer.parseInt(s.substring(3, 5)));
    return off;
  }

  private JavaSqlTimestampHelper() {}
}
