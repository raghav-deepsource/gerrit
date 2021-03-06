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

package com.google.gerrit.server.submit;

import com.google.common.collect.ImmutableList;
import com.google.gerrit.entities.BranchNameKey;
import com.google.gerrit.server.git.CodeReviewCommit;
import com.google.gerrit.server.update.RepoContext;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FastForwardOnly extends SubmitStrategy {
  FastForwardOnly(SubmitStrategy.Arguments args) {
    super(args);
  }

  @Override
  public ImmutableList<SubmitStrategyOp> buildOps(Collection<CodeReviewCommit> toMerge) {
    List<CodeReviewCommit> sorted = args.mergeUtil.reduceToMinimalMerge(args.mergeSorter, toMerge);

    Map<BranchNameKey, CodeReviewCommit> branchToCommit = new HashMap<>();
    for (CodeReviewCommit codeReviewCommit : sorted) {
      BranchNameKey branchNameKey = codeReviewCommit.change().getDest();
      CodeReviewCommit otherCommitInBranch = branchToCommit.get(branchNameKey);
      if (otherCommitInBranch == null) {
        branchToCommit.put(branchNameKey, codeReviewCommit);
      } else {
        // we found another change with the same destination branch.
        codeReviewCommit.setStatusCode(CommitMergeStatus.FAST_FORWARD_INDEPENDENT_CHANGES);
        otherCommitInBranch.setStatusCode(CommitMergeStatus.FAST_FORWARD_INDEPENDENT_CHANGES);
        return ImmutableList.of();
      }
    }

    ImmutableList.Builder<SubmitStrategyOp> ops =
        ImmutableList.builderWithExpectedSize(sorted.size());
    CodeReviewCommit newTipCommit =
        args.mergeUtil.getFirstFastForward(args.mergeTip.getInitialTip(), args.rw, sorted);
    if (!newTipCommit.equals(args.mergeTip.getInitialTip())) {
      ops.add(new FastForwardOp(args, newTipCommit));
    } else {
      for (CodeReviewCommit c : toMerge) {
        ops.add(new NotFastForwardOp(c));
      }
    }
    return ops.build();
  }

  private class NotFastForwardOp extends SubmitStrategyOp {
    private NotFastForwardOp(CodeReviewCommit toMerge) {
      super(FastForwardOnly.this.args, toMerge);
    }

    @Override
    public void updateRepoImpl(RepoContext ctx) {
      toMerge.setStatusCode(CommitMergeStatus.NOT_FAST_FORWARD);
    }
  }

  static boolean dryRun(
      SubmitDryRun.Arguments args, CodeReviewCommit mergeTip, CodeReviewCommit toMerge) {
    return args.mergeUtil.canFastForward(args.mergeSorter, mergeTip, args.rw, toMerge);
  }
}
