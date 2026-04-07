# Supabase Connection Troubleshooting Guide

## Current Issue
Login is failing with "Failed to fetch" error (AuthRetryableFetchError with status 0). This indicates a network connectivity issue between your browser and Supabase.

## Quick Diagnostic Steps

### Step 1: Run the Diagnostic Tool
1. Open your browser to: `http://localhost:8080/diagnose-supabase.html`
2. The tests will run automatically
3. Check which test fails first - this tells us where the problem is

### Step 2: Check Supabase Project Status
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Find your project: `rejudwrynbxoyzlrqqst`
4. **CRITICAL**: Check if the project shows "PAUSED" or "INACTIVE"
   - If paused: Click "Resume Project" or "Restore Project"
   - Wait 2-3 minutes for the project to fully start
   - Try the diagnostic tool again

### Step 3: Test Direct URL Access
1. Open a new browser tab
2. Go to: `https://rejudwrynbxoyzlrqqst.supabase.co`
3. You should see a JSON response or Supabase page
4. If you get "Cannot reach this page" or timeout:
   - Your network is blocking Supabase
   - Try Step 4

### Step 4: Network/Firewall Check
Try these in order:

1. **Disable VPN** (if you're using one)
   - Turn off any VPN software
   - Try the diagnostic tool again

2. **Check Firewall**
   - Windows Firewall might be blocking the connection
   - Temporarily disable Windows Firewall
   - Try the diagnostic tool again

3. **Try Different Network**
   - If on corporate/school network, it might block Supabase
   - Try using mobile hotspot
   - Try the diagnostic tool again

4. **Check Antivirus**
   - Some antivirus software blocks cloud services
   - Temporarily disable antivirus
   - Try the diagnostic tool again

### Step 5: Browser Check
1. Try a different browser (Chrome, Firefox, Edge)
2. Try incognito/private mode
3. Clear browser cache and cookies

## Common Causes and Solutions

### Cause 1: Supabase Project Paused ⭐ MOST COMMON
**Symptoms**: All tests fail, cannot reach URL
**Solution**: 
- Go to Supabase Dashboard
- Resume/Restore your project
- Wait 2-3 minutes
- Test again

### Cause 2: Network/Firewall Blocking
**Symptoms**: Test 1 fails with "Failed to fetch"
**Solution**:
- Disable VPN
- Check firewall settings
- Try different network

### Cause 3: CORS Issues
**Symptoms**: Test 1 passes, but Test 2-5 fail
**Solution**:
- Check Supabase Dashboard → Settings → API
- Ensure your localhost URL is allowed
- Add `http://localhost:8080` to allowed origins

### Cause 4: Invalid Credentials
**Symptoms**: Tests 1-4 pass, Test 5 fails
**Solution**:
- Verify admin user exists in Supabase Dashboard
- Check email is confirmed
- Reset password if needed

## What Each Test Means

| Test | What It Checks | If It Fails |
|------|----------------|-------------|
| Test 1 | Basic network connectivity | Cannot reach Supabase at all - check project status and network |
| Test 2 | REST API access | API is blocked - check CORS settings |
| Test 3 | Auth API access | Auth service is blocked - check CORS settings |
| Test 4 | Supabase client library | Client initialization issue - check configuration |
| Test 5 | Login with credentials | Authentication issue - check user exists and credentials |

## Expected Results (When Working)

All tests should show ✅ Success:
- Test 1: Status 200, URL is reachable
- Test 2: Status 200, REST API accessible
- Test 3: Status 200, Auth API healthy
- Test 4: Client initialized, session checked
- Test 5: Login success, user email shown

## Next Steps After Fixing

Once all diagnostic tests pass:
1. Go to `http://localhost:8080/login`
2. Enter credentials:
   - Email: `admin@lifebloom.com`
   - Password: `admin123456`
3. Click "Sign In"
4. You should be redirected to the dashboard

## Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Check Supabase Status Page**: https://status.supabase.com
   - Supabase might be having an outage

2. **Check Your Internet Connection**
   - Try accessing other websites
   - Run a speed test

3. **Contact Support**
   - Provide the diagnostic test results
   - Mention which test fails
   - Include any error messages

## Configuration Files

Your current configuration:
- Supabase URL: `https://rejudwrynbxoyzlrqqst.supabase.co`
- Project ID: `rejudwrynbxoyzlrqqst`
- Dev Server: `http://localhost:8080`
- Admin Email: `admin@lifebloom.com`

All configuration is correct. The issue is network connectivity.
