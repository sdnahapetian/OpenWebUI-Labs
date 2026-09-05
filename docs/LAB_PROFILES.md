# Runtime Lab Profiles

Lab profiles let one Open WebUI deployment present a deployment-wide login flavor and a different authenticated flavor for each account. Profile changes do not require rebuilding the Docker image.

## Configuration precedence

1. `LAB_CONFIG_FILE` provides defaults from a bind-mounted JSON file.
2. `LAB_CONFIG_JSON` provides the same defaults inline when no file is set.
3. Admin Settings → Interface → Lab Profiles persists later changes in the Open WebUI database.
4. Admin → Users → Edit User assigns a profile to an account.
5. When `allow_user_selection` is true, users can choose their own profile in Settings → Interface.

The unauthenticated login page accepts a configured profile ID in the `lab` query parameter, for example `/auth?lab=bug`. Unknown IDs safely fall back to `default_flavor`. After sign-in, the query parameter is ignored and a valid `user.settings.lab_flavor` takes precedence; users without an assignment receive `default_flavor`.

## Docker Compose

The sample [`docker-compose.lab.yaml`](../docker-compose.lab.yaml) mounts [`config/labs.json`](../config/labs.json). Combine it with the normal compose file:

```sh
docker compose -f docker-compose.yaml -f docker-compose.lab.yaml up -d
```

Changing the bind-mounted file requires a container restart. The file supplies the default for a new data volume; once an administrator saves Lab Profiles, the database value takes precedence. Admin changes are returned through `/api/config` immediately and do not require an image rebuild.

## Profile fields

Each entry under `profiles` supports `name`, mascot and login image URLs, login and welcome copy, sidebar labels, suggestions, font settings, and the `colors` map. Welcome copy accepts `{{user}}` and `{{model}}` placeholders.

The included file contains starting profiles for Chef Lab and Bug Lab. Keep remote font URLs empty for fully offline deployments and serve mascot or background assets under `/static`.
