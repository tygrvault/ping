# Ping ⏺️
A small scale chat application.

## Hosting locally
Since Ping uses Supabase to handle authentication and storing data, you'll need to setup the schema accordingly.  
If something goes wrong, or you need help, please don't hesitate to create a new issue or reach out via [email](mailto:hi@tygr.dev).

### Authentication
1. Go to [Supabase](https://supabase.com/dashboard/sign-in) and sign in.
2. Create a new project, give it a name, a strong password and choose a location for it.
3. Go to "Authentication", "Providers", click "Email" and disable the email provider.
4. Scroll down, click on "GitHub", enable it, and copy the callback URL. You'll probably notice that you need a client id and secret.
5. Head over to [GitHub](https://github.com/settings/developers) and create a new OAuth app.
6. Fill in the fields accordingly, and in the "Authorization callback URL" field, paste the "callback URL" you copied earlier.
7. Click "Register Application".
8. On the next page, copy your "Client ID" and paste it into the same field on Supabase.
9. Then click on "Generate a new client secret", copy the secret and paste that into Supabase too.
10. You can now close GitHub. Make sure to save the details in Supabase.

### Tables
Congrats, you just setup authentication. Now let's get the database tables setup.
1. Go to "Table editor" and create a new table called `rooms`, enable realtime and save.
2. Then create another table called `messages`, enable realtime and save.
3. When creating columns, make sure that all the "Constraints" are **disabled** [Example](https://github.com/tygerxqt/ping/assets/59417077/331f8ebb-4fe2-436c-bba7-5060c9ddf82c)
#### `messages` table
4. On the messages table, create the columns `room_id` with a foreign key relation to `public.rooms.id`, action set to `Cascade` ([Example](https://github.com/tygerxqt/ping/assets/59417077/621640b6-abb5-4649-af20-bdd6851d485a))
5. Create the column `content`, `username` and `avatar` with a text type.
6. Then create an `author_id` column with a foreign key relation to `auth.users.id`, and action set to `Cascade` ([Example](https://github.com/tygerxqt/ping/assets/59417077/a5c14719-3d75-4f18-8bcc-1767d62629da))
#### `rooms` table
7. On the `rooms` table, create the columns `name` and `description` with a text type.
8. Then create an `author_id` column with a foreign key relation to `auth.users.id`, and action set to `Cascade` ([Example](https://github.com/tygerxqt/ping/assets/59417077/a5c14719-3d75-4f18-8bcc-1767d62629da))

### RLS (Row Level Security)
Your tables are now setup! One last thing, the RLS (row level security) policies.
1. Go back to 'Authentication' and click 'Policies'.
2. When creating policies, make sure you click "For full customization".
#### `messages` table
3. Create a new policy called "Enable insert", allow the operation `INSERT`, with the target role of `authenticated`, and the `WITH CHECK expression` equals `true`. Click "Review" and "Save policy".
4. Do the same thing as step 3, but name it "Enable read", and instead of allowing the operation `INSERT`, allow `SELECT`.
#### `rooms` table
5. Create a new policy called "Enable delete", allow the operation `DELETE`, with no target roles, and the `USING expression` equals `(auth.uid() = author_id)`. Click "Review" and "Save policy".
6. Follow steps 3 and 4 again on the rows table.

### Setting up Ping
Supabase has been successfully configured. All we need to do now is get the Supabase instance URL, anon key, and service key!
1. Clone the repo and create a `.env` file.
2. Go to 'Project Settings', then 'API'.
3. Paste your Project URL, `anon` key and `service_role` key into your env like the example below.
```
SUPABASE_URL="https://************.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***********************"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***********************"
```
4. Run `pnpm dev -o` to start the development server or `pnpm build` to build Ping.

Congrats! You just got yourself your very own Ping instance running on your own Supabase project.

## Help
If more help is needed, you can contact me by [e-mail](mailto:hi@tygr.dev) or [tweet](https://twitter.com/intent/tweet?text=%40tygerxqt) to me.
