// Copyright (C) 2021 The Android Open Source Project
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

package com.google.gerrit.extensions.common;

/** API Input describing a submit requirement entity. */
public class SubmitRequirementInput {
  /** Submit requirement name. */
  public String name;

  /** Submit requirement description. */
  public String description;

  /**
   * Query expression that can be evaluated on any change. If evaluated to true on a change, the
   * submit requirement is then applicable on this change.
   */
  public String applicabilityExpression;

  /**
   * Query expression that can be evaluated on any change. If evaluated to true on a change, the
   * submit requirement is fulfilled and not blocking change submission.
   */
  public String submittabilityExpression;

  /**
   * Query expression that can be evaluated on any change. If evaluated to true on a change, the
   * submit requirement is overridden and not blocking change submission.
   */
  public String overrideExpression;

  /** Whether this submit requirement can be overridden in child projects. */
  public Boolean allowOverrideInChildProjects;
}
