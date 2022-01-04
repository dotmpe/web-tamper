.PHONY: sync

SHELL = /usr/bin/env bash

tm_dav_mount := /tmp/davfs/
tm_dav_path := $(tm_dav_mount)/Tampermonkey/sync

default:
sync::
	@grep -v '^#' scripttab | { \
		local uuid slug lname path; \
	while read uuid slug; \
	do lname="$$slug.user.js"; path="$(tm_dav_path)/$$uuid.user.js"; \
	test -e "$$path" || { \
		echo "No such UserScript installed '$$uuid'" >&2; exit 1; \
		test "$$lname" -nt "$$path" && { \
			cp "$$lname" "$$path"; \
		} || { \
			test "$$path" -nt "$$lname" && { \
				cp "$$path" "$$lname"; \
			} \
		} \
	}; \
	done
