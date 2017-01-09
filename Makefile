SHELL:=/bin/bash
LOCAL_DEPS=./node_modules

# Check for global dependencies and install them if necessary

check-yarn-install:
	@type yarn >/dev/null 2>&1 || npm i -g yarn@0.18.1

$(LOCAL_DEPS): check-yarn-install
	yarn

test: $(LOCAL_DEPS)
	API_KEY=123 yarn test

run: $(LOCAL_DEPS)
	yarn run query

.PHONY: \
	run \
	test \
