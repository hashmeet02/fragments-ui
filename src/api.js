// src/api.js

require('dotenv').config();

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
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

export async function postFragments(user, data, type){
  console.log('User Fragment data is being posted');
  try{
    if (type=='application/json'){
      data=JSON.parse(JSON.stringify(data));
    }
    
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "post",
      //headers: user.authorizationHeaders(),
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        'Content-type': type,
      },
      body: data
    });
    
    if (!res.ok){
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log("Fragment data posted",{data});
    console.log(res);
  }catch(err){
    console.error('Unable to call POST /v1/fragments', {err});
  }
  
}

export async function getUserFragmentList(user) {
  console.log('Fetching a list of user\'s for fragments');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Fragments list received:", {data});
    return data;
  } catch (err) {
    console.log('Unable to call GET /v1/fragments/?expand=1', { err });
  }
}

export async function getFragmentDataByID(user, id) {
  try {
    if (id != "") {
      console.log(`Requesting fragment data by ID at ${apiUrl}/v1/fragments/${id}`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        headers: user.authorizationHeaders(),
      });


      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const type = res.headers.get("Content-Type");
      if (type.includes("text")) {
        const data = await res.text();
        console.log(`Received user fragment by ID: ${id}`, { data });
        document.getElementById("returnedData").innerHTML = data;
      } else if (type.startsWith("image")) {
        const data = await res.blob();
        console.log(`Received user fragment by ID: ${id}`, { data });
        var image = document.querySelector('img');
        // see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
        var objectURL = URL.createObjectURL(data);
        image.src = objectURL;
      } else if (type.includes("json")) {
        const data = await res.json();
        console.log(data);
      } 
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}

export async function getFragmentInfoByID(user, id) {
  try {
    if (id != "") {
      console.log(`Requesting user fragment info by ID at Fetching ${apiUrl}/v1/fragments/${id}/info`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
        headers: user.authorizationHeaders(),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log(`Received user fragment info by ID: ${id}`, { data });
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}/info`, { err });
  }
}

export async function deleteFragmentDataByID(user, id) {
  try {
    if (id != "") {
      console.log(`Deleting user fragment info by ID: ${id}...`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        method: "delete",
        headers: user.authorizationHeaders(),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      console.log(`Successfully deleted fragment ID: ${id}`);
      console.log(res);
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call DELETE /v1/fragments/${id}`, { err });
  }
}

export async function updateFragmentByID(user, data, type, id) {
  console.log(`Updating user fragment data by ID: ${id}...`);

  try {
    if (id != "") {
      console.log(`Updating user fragment data by ID: ${id}...`);
      if (type == 'application/json'){
        data = JSON.parse(JSON.stringify(data));
      }

      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${user.idToken}`,
          'Content-type': type,
        },
        body: data
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      console.log(`Updated user fragment data by: ${id}`, { data });
      console.log(res);
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call PUT /v1/fragments/${id}`, { err });
  }
}