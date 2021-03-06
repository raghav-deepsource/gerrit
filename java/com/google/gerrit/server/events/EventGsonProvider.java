// Copyright (C) 2019 The Android Open Source Project
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

package com.google.gerrit.server.events;

import com.google.common.base.Supplier;
import com.google.gerrit.entities.EntitiesAdapterFactory;
import com.google.gerrit.entities.Project;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Provider;

public class EventGsonProvider implements Provider<Gson> {
  @Override
  public Gson get() {
    return new GsonBuilder()
        .registerTypeAdapter(Event.class, new EventSerializer())
        .registerTypeAdapter(Event.class, new EventDeserializer())
        .registerTypeAdapter(Supplier.class, new SupplierSerializer())
        .registerTypeAdapter(Supplier.class, new SupplierDeserializer())
        .registerTypeAdapterFactory(EntitiesAdapterFactory.create())
        .registerTypeHierarchyAdapter(Project.NameKey.class, new ProjectNameKeyAdapter())
        .create();
  }
}
