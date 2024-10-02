# convo-ai-prototype

This is the source code for a very simple [wizard of oz prototype](https://convoai-prototype.herokuapp.com/) used in the Conversational AI-based Agent co-design study. This is a collaborative study with the Cornell Social Media Lab and Prof. Qian Yang.

## Description

This wizard of oz prototype will be used in the second or third round of co-design interviews with students and educators.

It is an early iteration of the final product (which is the [“How to be an Upstander”](https://app.socialmediatestdrive.org/intro/cyberbullying) module that implements a fully independent and functioning conversational ai component in the free-play section). The wizard of oz prototype allows us to fake the “conversational ai agent” responses to test the responses with end-users and get their feedback, before building the final product. The end-users do not know the responses are human-controlled, but think they are computer-driven.

## Demo website
https://convoai-prototype.herokuapp.com/ (OpenAI API is disabled in the demo, but all other functionalities are functional)

## Definitions
* **Student** The participant of the study (named "Guest" on the platform)
* **Researcher:** The researcher of the study who acted as the "wizard", adopting multiple fictitious personas (named "Mrs. Warren", "Daniel Powers", "Alfred Fluffington", "Conversational AI Agent" on the platform) depending on the needs expressed by participants. Example, a supportive peer, an educator, etc.
  
## Functionalities 
*  Researchers and Students can enter the same room by submitting the same "Session ID".
*  _Posts:_ Liking and flagging posts & liking, flagging, and adding comments are all functional, persistent, and recorded in the database with their corresponding session by "Session ID".
     * All comments made by either the student or researcher are shown on the website in real time to others in the same "Session ID" room.
     * A response is generated from the GPT-3 off-the-shelf model and given to the Researcher whenever a User makes a comment. These responses can be edited before sent.
     * The platform logs all the comments left by the User and the Researcher, and the GPT-3 model output.
* The Researcher can toggle between multiple fictitious personas in the footer.

## Behavior
If you open the above link in two different tabs or browsers side by side, you'll be able to see what the WoZ prototype looksl ike with 2 (or more) people on the site at once.

One tab simulates the tab the student has open on their own laptop, and the other tab simulates the tab the researcher has open on their own laptop.

* A Student and a Researcher can submit the same “Session ID” value into the input field on the landing page to enter the same “room”. Only people in the same “room” can see the comments that are left by others in that same “room”.
    * Note: You can therefore use the “Session ID” to distinguish between each co-design interview/session. 
    * All comments (from both the Student and the researcher) are logged in a MongoDB database. So if you want to see the comments that were left in a co-design interview/session retro-actively, you can enter the past “Session ID” into the input field, and the interface will display the comments. Alternatively, you can access it through the URL, by appending the “Session ID” value as the first route parameter (ex: Session ID = ‘test’, URL = https://convoai-prototype.herokuapp.com/test) 
* Anyone can leave a comment on any post. Leaving a comment on the post will reflect and appear on any other browsers open that are also in the same “Session ID” room, and it will also display a notification to all the other users. Clicking on this notification scrolls the window to the corresponding post.
* If a person wants to play the Researcher, they can turn on the toggle isAgent at the footer and select a persona, which will then display all of that person’s future comments as the persona selected. By default, the persona selected is "Mrs. Warren", but can be changed to any of the other personas. While isAgent is turned on, the Researcher will also see the GPT-3 model output to comments that Students are making, and the Researcher can edit it. Also, the screen will automatically scroll to any comments that come in from other Students, so it makes it easier for the Researcher to follow and see when and where a Student left a comment.

## How to install locally
### Installing the Prerequisites
Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/installing-the-prerequisites
### Setting up the interface locally
Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/setting-up-truman-locally
* Additionally, in the .env file, set ENABLE_GPT=TRUE and your OPENAI_API_KEY and ORGANIZATION_KEY.

## Publication
Zou, W., Yang, Q., DiFranzo, D., Chen, M., Hui, W., Bazarova, N.N. (2024). [Social Media Co-pilot: Designing a chatbot with teens and educators to combat cyberbullying](https://doi.org/10.1016/j.ijcci.2024.100680), _International Journal of Child-Computer Interaction, 41_, [https://doi.org/10.1016/j.ijcci.2024.100680](https://www.sciencedirect.com/science/article/pii/S2212868924000497).
