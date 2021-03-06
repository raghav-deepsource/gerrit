// Copyright (C) 2020 The Android Open Source Project
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

package com.google.gerrit.server.change;

import com.google.gerrit.entities.Account;
import com.google.gerrit.extensions.restapi.RestResource;
import com.google.gerrit.extensions.restapi.RestView;
import com.google.inject.TypeLiteral;

/** REST resource that represents an entry in the attention set of a change. */
public class AttentionSetEntryResource implements RestResource {
  public static final TypeLiteral<RestView<AttentionSetEntryResource>> ATTENTION_SET_ENTRY_KIND =
      new TypeLiteral<>() {};

  public interface Factory {
    AttentionSetEntryResource create(ChangeResource change, Account.Id id);
  }

  private final ChangeResource changeResource;
  private final Account.Id accountId;

  public AttentionSetEntryResource(ChangeResource changeResource, Account.Id accountId) {
    this.changeResource = changeResource;
    this.accountId = accountId;
  }

  public ChangeResource getChangeResource() {
    return changeResource;
  }

  public Account.Id getAccountId() {
    return accountId;
  }
}
