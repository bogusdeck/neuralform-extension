# Security Improvements (To Add Later)

This document outlines security enhancements to implement when the extension is ready for public release or when you want to share it with others.

---

## Current Security Setup

- ✅ Anon key used in client code (designed for public use)
- ✅ Row Level Security (RLS) enabled
- ⚠️ Current policies allow public access to all data
- ⚠️ Anyone with the extension can read/write all data

---

## Recommended Improvements

### 1. User-Based Row Level Security

**Current Issue**: Policies allow anyone to access all data
```sql
CREATE POLICY "Allow public read access"
    ON user_profiles
    FOR SELECT
    USING (true);  -- Anyone can read everything
```

**Improved Solution**: Restrict access to user's own data
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON user_profiles;
DROP POLICY IF EXISTS "Allow public insert access" ON user_profiles;
DROP POLICY IF EXISTS "Allow public update access" ON user_profiles;
DROP POLICY IF EXISTS "Allow public delete access" ON user_profiles;

-- Create user-based policies
CREATE POLICY "Users can read own data"
    ON user_profiles
    FOR SELECT
    USING (user_id = current_setting('app.user_id')::text);

CREATE POLICY "Users can insert own data"
    ON user_profiles
    FOR INSERT
    WITH CHECK (user_id = current_setting('app.user_id')::text);

CREATE POLICY "Users can update own data"
    ON user_profiles
    FOR UPDATE
    USING (user_id = current_setting('app.user_id')::text)
    WITH CHECK (user_id = current_setting('app.user_id')::text);

CREATE POLICY "Users can delete own data"
    ON user_profiles
    FOR DELETE
    USING (user_id = current_setting('app.user_id')::text);
```

### 2. Update Code to Set User Context

**Update `config/supabase.js`**:

```javascript
async function saveUserData(data) {
    const client = initSupabase();
    const userId = await generateUserId();

    // Set user context for RLS
    await client.rpc('set_config', { name: 'app.user_id', value: userId });

    const userData = {
        user_id: userId,
        // ... rest of data
    };

    const { data: result, error } = await client
        .from('user_profiles')
        .upsert(userData, { onConflict: 'user_id' })
        .select();

    // ... rest of function
}

async function getUserData() {
    const client = initSupabase();
    const userId = await generateUserId();

    // Set user context for RLS
    await client.rpc('set_config', { name: 'app.user_id', value: userId });

    const { data, error } = await client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    // ... rest of function
}

async function clearUserData() {
    const client = initSupabase();
    const userId = await generateUserId();

    // Set user context for RLS
    await client.rpc('set_config', { name: 'app.user_id', value: userId });

    const { error } = await client
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

    // ... rest of function
}
```

### 3. Add Data Encryption (Optional)

For sensitive data like phone numbers, addresses:

```javascript
async function encryptData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));

    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
    );

    return { encrypted, key, iv };
}
```

### 4. Add Authentication (Advanced)

Implement Supabase Auth for production:

```javascript
// Add login/signup to extension
async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return data;
}

// Use auth session for RLS
await supabase.auth.setSession(session);
```

---

## Implementation Priority

### High Priority (Before Public Release)
1. ✅ User-based RLS policies
2. ✅ Update code to set user context

### Medium Priority (If Sharing with Others)
3. Data encryption for sensitive fields
4. Add rate limiting

### Low Priority (Advanced)
5. Full authentication system
6. Audit logging
7. Data export/import with encryption

---

## When to Implement

### Personal Use Only
- Current setup is fine
- No changes needed

### Share with Friends/Family
- Implement High Priority items (user-based RLS)

### Public Release
- Implement High + Medium Priority items
- Consider full authentication

---

## Testing Security

After implementing improvements:

1. Test that users can only access their own data
2. Verify encryption/decryption works
3. Test authentication flow
4. Audit logs for security events
5. Load test for rate limiting

---

## Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [WebExtension Security](https://extensionworkshop.com/documentation/develop/secure-development)

---

**Note**: This is for future implementation. Current setup is safe for personal use.
