#!/bin/bash

#  if [[ "x$PROD" == "x" ]]; then
	#  echo "This script is for starting in production."
	#  echo "Use"
	#  echo "   mix phx.server"
	#  exit
#  fi

export SECRET_KEY_BASE=W68eso5YQOlbtvSNUR50N/HDWj6IaEhAwMR3LtzuBEQAefwYVbX84bvoTA7XtiGi
export MIX_ENV=prod
export PORT=5690

echo "Stopping old copy of app, if any..."

_build/prod/rel/hw05/bin/hw05 stop || true

echo "Starting app..."

_build/prod/rel/hw05/bin/hw05 start
