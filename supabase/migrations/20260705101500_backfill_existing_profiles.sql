insert into public.profiles (id, full_name, email)
select
  id,
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1), 'User'),
  coalesce(email, id::text || '@local.invalid')
from auth.users
on conflict (id) do nothing;
