// Copyright (C) 2015 The Android Open Source Project
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

package com.google.gerrit.server.extensions.events;

import com.google.common.collect.Lists;
import com.google.common.flogger.FluentLogger;
import com.google.gerrit.entities.PatchSet;
import com.google.gerrit.exceptions.StorageException;
import com.google.gerrit.extensions.api.changes.NotifyHandling;
import com.google.gerrit.extensions.common.AccountInfo;
import com.google.gerrit.extensions.common.ChangeInfo;
import com.google.gerrit.extensions.common.RevisionInfo;
import com.google.gerrit.extensions.events.ReviewerAddedListener;
import com.google.gerrit.server.GpgException;
import com.google.gerrit.server.account.AccountState;
import com.google.gerrit.server.patch.PatchListNotAvailableException;
import com.google.gerrit.server.patch.PatchListObjectTooLargeException;
import com.google.gerrit.server.permissions.PermissionBackendException;
import com.google.gerrit.server.plugincontext.PluginSetContext;
import com.google.gerrit.server.query.change.ChangeData;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import java.io.IOException;
import java.time.Instant;
import java.util.List;

/** Helper class to fire an event when reviewers have been added to a change. */
@Singleton
public class ReviewerAdded {
  private static final FluentLogger logger = FluentLogger.forEnclosingClass();

  private final PluginSetContext<ReviewerAddedListener> listeners;
  private final EventUtil util;

  @Inject
  ReviewerAdded(PluginSetContext<ReviewerAddedListener> listeners, EventUtil util) {
    this.listeners = listeners;
    this.util = util;
  }

  public void fire(
      ChangeData changeData,
      PatchSet patchSet,
      List<AccountState> reviewers,
      AccountState adder,
      Instant when) {
    if (listeners.isEmpty() || reviewers.isEmpty()) {
      return;
    }

    try {
      Event event =
          new Event(
              util.changeInfo(changeData),
              util.revisionInfo(changeData.project(), patchSet),
              Lists.transform(reviewers, util::accountInfo),
              util.accountInfo(adder),
              when);
      listeners.runEach(l -> l.onReviewersAdded(event));
    } catch (PatchListObjectTooLargeException e) {
      logger.atWarning().log("Couldn't fire event: %s", e.getMessage());
    } catch (PatchListNotAvailableException
        | GpgException
        | IOException
        | StorageException
        | PermissionBackendException e) {
      logger.atSevere().withCause(e).log("Couldn't fire event");
    }
  }

  /** Event to be fired when reviewers have been added to a change. */
  private static class Event extends AbstractRevisionEvent implements ReviewerAddedListener.Event {
    private final List<AccountInfo> reviewers;

    Event(
        ChangeInfo change,
        RevisionInfo revision,
        List<AccountInfo> reviewers,
        AccountInfo adder,
        Instant when) {
      super(change, revision, adder, when, NotifyHandling.ALL);
      this.reviewers = reviewers;
    }

    @Override
    public List<AccountInfo> getReviewers() {
      return reviewers;
    }
  }
}
