// Copyright (C) 2017 The Android Open Source Project
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

package com.google.gerrit.server.index.project;

import com.google.gerrit.common.Nullable;
import com.google.gerrit.entities.Project;
import com.google.gerrit.index.IndexDefinition;
import com.google.gerrit.index.project.ProjectData;
import com.google.gerrit.index.project.ProjectIndex;
import com.google.gerrit.index.project.ProjectIndexCollection;
import com.google.gerrit.index.project.ProjectSchemaDefinitions;
import com.google.inject.Inject;

/** Bundle of service classes that make up the project index. */
public class ProjectIndexDefinition
    extends IndexDefinition<Project.NameKey, ProjectData, ProjectIndex> {

  @Inject
  ProjectIndexDefinition(
      ProjectIndexCollection indexCollection,
      ProjectIndex.Factory indexFactory,
      @Nullable AllProjectsIndexer allProjectsIndexer) {
    super(ProjectSchemaDefinitions.INSTANCE, indexCollection, indexFactory, allProjectsIndexer);
  }
}
