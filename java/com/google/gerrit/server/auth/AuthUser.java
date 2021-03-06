// Copyright (C) 2012 The Android Open Source Project
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

package com.google.gerrit.server.auth;

import static java.util.Objects.requireNonNull;

import com.google.auto.value.AutoValue;
import com.google.gerrit.common.Nullable;

/** An authenticated user as specified by the AuthBackend. */
public class AuthUser {

  /** Globally unique identifier for the user. */
  @AutoValue
  public abstract static class UUID {
    /**
     * A new unique identifier.
     *
     * @param uuid the unique identifier.
     * @return identifier instance.
     */
    public static UUID create(String uuid) {
      return new AutoValue_AuthUser_UUID(uuid);
    }

    public abstract String uuid();
  }

  private final UUID uuid;
  private final String username;

  /**
   * An authenticated user.
   *
   * @param uuid the globally unique ID.
   * @param username the name of the authenticated user.
   */
  public AuthUser(UUID uuid, @Nullable String username) {
    this.uuid = requireNonNull(uuid);
    this.username = username;
  }

  /** Returns the globally unique identifier. */
  public final UUID getUUID() {
    return uuid;
  }

  /** Returns the backend specific user name, or null if one does not exist. */
  @Nullable
  public final String getUsername() {
    return username;
  }

  /** Returns {@code true} if {@link #getUsername()} is not null. */
  public final boolean hasUsername() {
    return getUsername() != null;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof AuthUser) {
      return getUUID().equals(((AuthUser) obj).getUUID());
    }
    return false;
  }

  @Override
  public int hashCode() {
    return getUUID().hashCode();
  }

  @Override
  public String toString() {
    return String.format("AuthUser[uuid=%s, username=%s]", getUUID(), getUsername());
  }
}
