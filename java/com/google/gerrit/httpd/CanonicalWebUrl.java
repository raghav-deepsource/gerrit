// Copyright (C) 2013 The Android Open Source Project
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

package com.google.gerrit.httpd;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.gerrit.common.Nullable;
import com.google.inject.Inject;
import com.google.inject.Provider;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;

public class CanonicalWebUrl {
  private final Provider<String> configured;

  @Inject
  CanonicalWebUrl(
      @com.google.gerrit.server.config.CanonicalWebUrl @Nullable Provider<String> provider) {
    configured = provider;
  }

  public String get(HttpServletRequest req) {
    String url = configured.get();
    return url != null ? url : computeFromRequest(req);
  }

  @SuppressWarnings("JdkObsolete")
  static String computeFromRequest(HttpServletRequest req) {
    StringBuffer url = req.getRequestURL();
    try {
      url = new StringBuffer(URLDecoder.decode(url.toString(), UTF_8.name()));
      url.setLength(url.length() - req.getServletPath().length());
      if (url.charAt(url.length() - 1) != '/') {
        url.append('/');
      }
      return url.toString();
    } catch (UnsupportedEncodingException e) {
      throw new IllegalStateException("Unsupported encoding for request URL " + url, e);
    }
  }
}
