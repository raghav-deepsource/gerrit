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

import com.google.common.flogger.FluentLogger;
import com.google.gerrit.exceptions.StorageException;
import com.google.gerrit.extensions.api.changes.NotifyHandling;
import com.google.gerrit.extensions.common.AccountInfo;
import com.google.gerrit.extensions.common.ChangeInfo;
import com.google.gerrit.extensions.events.TopicEditedListener;
import com.google.gerrit.server.account.AccountState;
import com.google.gerrit.server.plugincontext.PluginSetContext;
import com.google.gerrit.server.query.change.ChangeData;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import java.time.Instant;

/** Helper class to fire an event when the topic of a change has been edited. */
@Singleton
public class TopicEdited {
  private static final FluentLogger logger = FluentLogger.forEnclosingClass();

  private final PluginSetContext<TopicEditedListener> listeners;
  private final EventUtil util;

  @Inject
  TopicEdited(PluginSetContext<TopicEditedListener> listeners, EventUtil util) {
    this.listeners = listeners;
    this.util = util;
  }

  public void fire(ChangeData changeData, AccountState account, String oldTopicName, Instant when) {
    if (listeners.isEmpty()) {
      return;
    }
    try {
      Event event =
          new Event(util.changeInfo(changeData), util.accountInfo(account), oldTopicName, when);
      listeners.runEach(l -> l.onTopicEdited(event));
    } catch (StorageException e) {
      logger.atSevere().withCause(e).log("Couldn't fire event");
    }
  }

  /** Event to be fired when the topic of a change has been edited. */
  private static class Event extends AbstractChangeEvent implements TopicEditedListener.Event {
    private final String oldTopic;

    Event(ChangeInfo change, AccountInfo editor, String oldTopic, Instant when) {
      super(change, editor, when, NotifyHandling.ALL);
      this.oldTopic = oldTopic;
    }

    @Override
    public String getOldTopic() {
      return oldTopic;
    }
  }
}
