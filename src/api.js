// src/api.js

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function postFragments(user, data, type){
  console.log('User Fragment data is being posted');
  try{
    const headers = {
      ...user.authorizationHeaders(),
      'Content-Type': type, // Ensure the Content-Type is set based on the function parameter
    };

    const res=await fetch(`${apiUrl}/v1/fragments`,{
      method:"POST",
      headers: headers,
      body:data
    });
    
    if (!res.ok){
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log("Fragment data posted",{data});
    console.log(res);
  }catch(err){
    console.error('Unable to call POST /v1/fragment', {err});
  }
}