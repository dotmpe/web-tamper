.PHONY: sync fix-perms

SHELL = /usr/bin/env bash

tm_dav_mount := /tmp/davfs
tm_dav_path := $(tm_dav_mount)/Tampermonkey/sync

default:

fix-perms::
	sudo chgrp $$USER -R $(tm_dav_path)
	sudo chmod g+rw -R $(tm_dav_path)

add:: ID:=
add::
	@test -n "$(ID)"
	@uuid=$$(test -e "$(ID)" && basename "$(ID)" .meta.json || echo "$(ID)"); \
		name="$$(jq -r '.name' "$(tm_dav_path)/$$uuid.meta.json")"; \
		slug="$$(echo "$$name" | sed 's/[^0-9A-Za-z_]\+/_/g')"; \
		cp $(tm_dav_path)/$$uuid.user.js ./$$slug.user.js

scriptstab::
	@for meta in $(tm_dav_path)/*.meta.json; \
	do \
		jq -r ' . | "\(.uuid) \(.name)"' "$$meta"; \
	done | { echo "# UUID Slug"; while read uuid name; \
	do \
		slug="$$(echo "$$name" | sed 's/[^0-9A-Za-z_]\+/_/g')"; \
		test -e "$$slug.user.js" || { \
			echo "Script '$$name' <$$uuid> is not versioned, skipped" >&2; continue; \
		}; \
		echo "$$uuid $$slug"; \
	done; }>"$@"

sync:: fix-perms scriptstab
	@grep -v '^#' scriptstab | { \
		uuid= slug= lname= path=; \
		while read uuid slug; \
		do lname="$$slug.user.js"; path="$(tm_dav_path)/$$uuid.user.js"; \
			test -e "$$path" || { \
				echo "No such UserScript installed '$$uuid'" >&2; exit 1; \
			}; \
			\
			test "$$lname" -nt "$$path" && { \
				cp -v "$$lname" "$$path"; \
			} || { \
				test "$$path" -nt "$$lname" && { \
					cp -v "$$path" "$$lname"; \
				} \
			}; \
		done; \
	}
