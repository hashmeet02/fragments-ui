// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments,postFragments, getUserFragmentList } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postBtn = document.querySelector('#post');
  const postSec = document.querySelector('#postSec');
  const getBtn = document.querySelector('#get');
  const getListBtn = document.querySelector('#getList');
  const displayData = document.querySelector('#displayData');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    postSec.hidden=true;
    return;
  }



  // // Do an authenticated request to the fragments API server and log the result
  // const userFragments = await getUserFragments(user);
  // console.log(userFragments)

  postBtn.onclick=()=>{
    let data= document.querySelector(`#data`).value;
    let type=document.querySelector("#types").value;
    postFragments(user,data,type)
  }

  //get the list of fragment ids for user
  getBtn.onclick=async ()=>{
    const data= await getUserFragments(user);
    const formattedData = JSON.stringify(data, null, 2);
    document.querySelector("#displayData").value=formattedData;
    displayData.hidden=false;
  }

  //get the list of fragment metadata for user
  getListBtn.onclick=async ()=>{
    const data= await getUserFragmentList(user);
    const formattedData = JSON.stringify(data, null, 2);
    document.querySelector("#displayData").value=formattedData;
    displayData.hidden=false;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  getUserFragmentList(user);

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);