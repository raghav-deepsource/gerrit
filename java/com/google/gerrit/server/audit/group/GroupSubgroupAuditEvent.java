// Copyright (C) 2018 The Android Open Source Project
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

package com.google.gerrit.server.audit.group;

import com.google.auto.value.AutoValue;
import com.google.common.collect.ImmutableSet;
import com.google.gerrit.entities.Account;
import com.google.gerrit.entities.AccountGroup;
import java.time.Instant;

@AutoValue
public abstract class GroupSubgroupAuditEvent implements GroupAuditEvent {
  public static GroupSubgroupAuditEvent create(
      Account.Id actor,
      AccountGroup.UUID updatedGroup,
      ImmutableSet<AccountGroup.UUID> modifiedSubgroups,
      Instant timestamp) {
    return new AutoValue_GroupSubgroupAuditEvent(actor, updatedGroup, modifiedSubgroups, timestamp);
  }

  @Override
  public abstract Account.Id getActor();

  @Override
  public abstract AccountGroup.UUID getUpdatedGroup();

  /** Gets the added or deleted subgroups of the updated group. */
  public abstract ImmutableSet<AccountGroup.UUID> getModifiedSubgroups();

  @Override
  public abstract Instant getTimestamp();
}
