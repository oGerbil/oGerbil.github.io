// const axios = require("axios");

// API input variables
const apiForm = document.getElementById("api-form");
const apiInput = document.getElementById("api-input");
const apiSubmit = document.getElementById("api-submit");
let apiKey;
let introMessage;

// Chatbot input variables
const inputForm = document.getElementById("input-form");
const inputInput = document.getElementById("input-input");
const infos = document.getElementById("infos");

/*----------------------------------
    * Show chat form, hide API form
----------------------------------*/
function enableinputForm() {
    inputForm.style.display = "block"; // display the chat form
    apiForm.style.display = "none"; // hide the api form
    infos.style.display = "none";
}

function enableAPIForm() {
    inputForm.style.display = "none"; // hide the chat form
    apiForm.style.display = "block"; // display the api form
    infos.style.display = "none";
}

function enableResults() {
    inputForm.style.display = "none";
    apiForm.style.display = "none";
    infos.style.display = "block";
}

/*----------------------------------
    * Reset API and chat forms
----------------------------------*/
function resetForms() {
    apiInput.value = "";
    resetInfo();
    enableAPIForm();
}

function resetInfo() {
    inputInput.value = "";
    // catInput.value = "";
    infos.innerHTML = "";
}

/*----------------------------------
    * Display + Hide loading (loading...) chatbot info
----------------------------------*/
function showloadingIndicator() {
    // Display (...) on screen
    infos.innerHTML +=
        `<div class="info bot-info loading-indicator">
            <span class="bot-box round-rect">
                loading ...
            </span>
        </div>`;
}

function hideloadingIndicator() {
    const loadingIndicator = document.querySelector(".loading-indicator");
    if (loadingIndicator) {
        loadingIndicator.remove();
        inputForm.style.display = "none";
    }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
EVENT LISTENER FOR API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (1) Waits for API key to be submitted (i.e., user presses enter or "submit" button)
    (2) Shows the chatbox
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
apiForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    apiKey = apiInput.value.trim(); // remove extra spaces, periods, etc. from front and back of API key
    // Assuming the API key is valid, enable chat form
    enableinputForm();
}); 

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
EVENT LISTENER FOR BOT
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    (1) Waits for info to be submitted (i.e., user presses enter or "send" button)
    (2) Sends info to OpenAI API
    (3) Sends a response info from OpenAI API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
inputForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = "input: " + inputInput.value + ""; // User's input

    /***************************************************
2*      * TODO: Adjust the user's info to chatbot
    * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * ^ This is optional if you change the configuration of the chatbot below!
    * Add information to the quotes ("").
    * Example: "The food is: " + userInput + "Please provide"...
    ***************************************************/
    const inputPrompt = "" + userInput + "";

    // Reset to blank user input to wait for next info
    inputInput.value = "";

    try {
        enableResults();
        showloadingIndicator();

    /***************************************************
3*      * TODO: Adjust the configuration of** chatbot
    * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * Adjust the "format" and "botRole".
    * format = HTML you want it to be structured as
    ***************************************************/
            const format = `
                #, 6 digits.
                `;
            const botRole = `"You will be provided a mood. Provide a pastel colour that best fits this mood. Only provide Hexadecimal.`;

            console.log(inputPrompt);
            // console.log(botRole);
            // Use node.js axios library to make a POST request to the OpenAI API
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions", {
                    messages: [
                        { role: "system", content: botRole },
                        { role: "user", content: inputPrompt },
                    ],
                    model: "gpt-3.5-turbo", // Use the ChatGPT 3.5 model
                    temperature: 0,
                    max_tokens: 512,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            // Set chatbot response as what was sent back from OpenAI API
            // console.log(response);

            const apiResponse = response.data.choices[0].message.content;
        hideloadingIndicator();
        
        // Display chatbot's info on screen
        document.body.style.background = apiResponse;

        infos.innerHTML +=
            `<div class="info bot-info">
                <div class="bot-box round-rect">
                    The colour we have generated is: ${apiResponse}
                </div>
            </div>`;

    } catch (error) { // OpenAI API could not be reached!!!

        hideloadingIndicator();

        const errorMessage = "Invalid API key. Please try again in a few seconds.";

        // Display chatbot's error info on screen
        infos.innerHTML +=
            `<div class="info bot-info">
                <span class="bot-box round-rect">
                    ${errorMessage}
                </span>
            </div>`;

        // Display info in terminal
        console.error(error);

        // Reset everything after waiting 3000 ms
        setTimeout(resetForms, 3000);
    }
});

