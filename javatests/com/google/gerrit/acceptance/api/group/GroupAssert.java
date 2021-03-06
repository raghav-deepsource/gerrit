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

package com.google.gerrit.acceptance.api.group;

import static com.google.common.truth.Truth.assertThat;
import static com.google.common.truth.Truth.assertWithMessage;

import com.google.gerrit.entities.InternalGroup;
import com.google.gerrit.extensions.common.GroupInfo;
import com.google.gerrit.extensions.restapi.Url;
import java.util.Set;

public class GroupAssert {

  public static void assertGroups(Iterable<String> expected, Set<String> actual) {
    for (String g : expected) {
      assertWithMessage("missing group " + g).that(actual.remove(g)).isTrue();
    }
    assertWithMessage("unexpected groups: " + actual).that(actual).isEmpty();
  }

  public static void assertGroupInfo(InternalGroup group, GroupInfo info) {
    if (info.name != null) {
      // 'name' is not set if returned in a map
      assertThat(info.name).isEqualTo(group.getName());
    }
    assertThat(Url.decode(info.id)).isEqualTo(group.getGroupUUID().get());
    assertThat(info.groupId).isEqualTo(Integer.valueOf(group.getId().get()));
    assertThat(info.url).isEqualTo("#/admin/groups/uuid-" + Url.encode(group.getGroupUUID().get()));
    assertThat(toBoolean(info.options.visibleToAll)).isEqualTo(group.isVisibleToAll());
    assertThat(info.description).isEqualTo(group.getDescription());
    assertThat(Url.decode(info.ownerId)).isEqualTo(group.getOwnerGroupUUID().get());
    assertThat(info.createdOn.toInstant()).isEqualTo(group.getCreatedOn());
  }

  public static boolean toBoolean(Boolean b) {
    if (b == null) {
      return false;
    }
    return b.booleanValue();
  }
}
