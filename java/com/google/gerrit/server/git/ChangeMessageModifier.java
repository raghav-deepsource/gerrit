// Copyright (C) 2016 The Android Open Source Project
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

package com.google.gerrit.server.git;

import com.google.gerrit.common.Nullable;
import com.google.gerrit.entities.BranchNameKey;
import com.google.gerrit.extensions.annotations.ExtensionPoint;
import org.eclipse.jgit.revwalk.RevCommit;

/**
 * Allows to modify the commit message for new commits generated by Rebase Always submit strategy.
 *
 * <p>Invoked by Gerrit when all information about new commit is already known such as parent(s),
 * tree hash, etc, but commit's message can still be modified.
 */
@ExtensionPoint
public interface ChangeMessageModifier {

  /**
   * Implementation must return non-Null commit message.
   *
   * <p>mergeTip and original commit are guaranteed to have their body parsed, meaning that their
   * commit messages and footers can be accessed.
   *
   * @param newCommitMessage the new commit message that was result of either
   *     <ul>
   *       <li>{@link MergeUtil#createDetailedCommitMessage} called before
   *       <li>other extensions or plugins implementing the same point and called before.
   *     </ul>
   *
   * @param original the commit of the change being submitted. <b>Note that its commit message may
   *     be different than newCommitMessage argument.</b>
   * @param mergeTip the current HEAD of the destination branch, which will be a parent of a new
   *     commit being generated. mergeTip can be null if the destination branch does not yet exist.
   * @param destination the branch onto which the change is being submitted
   * @return a new not null commit message.
   */
  String onSubmit(
      String newCommitMessage,
      RevCommit original,
      @Nullable RevCommit mergeTip,
      BranchNameKey destination);
}
