#!/usr/bin/env bash
# Copyright (C) 2015 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

bazel_bin=$(which bazelisk 2>/dev/null)
if [[ -z "$bazel_bin" ]]; then
    echo "Warning: bazelisk is not installed; falling back to bazel."
    bazel_bin=bazel
fi

set -eu
SCRIPTNAME=$(mktemp)
trap "{ rm -f $SCRIPTNAME; }" EXIT
${bazel_bin} run --script_path="$SCRIPTNAME" //polygerrit-ui:devserver
"$SCRIPTNAME" "$@"
