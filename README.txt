##information

Name: Pavle Vujicic
Project Name: “Open Gallery”
YouTube Link Demonstration: https://youtu.be/nEee0bbDUXs 

##Purpose

Create a web application to provide exhibition space for artists, to showcase their work and connect artists with the community.
The application maintains a database of art items and supports two types of users: patrons and artists.
Patrons can browse all the information on the site, add reviews and “likes” to artworks, “follow” artists and join workshops.
Artists can add new artwork or host a workshop. Artists and patrons are considered “users”; their accounts have different features.

##List of Files

app.js
database-init.js
gallery.json
package.json
package-lock.json

public/
css.styles

models/
artwork.js
user.js
workshop.js

views/
account.pug
add-artwork-promtp.pug
add-workshop.pug
artist-profile.pug
artwork.pug
following.pug
header.pug
login.pug
notifications.pug
register.pug
search.pug
add-artwork.pug
enrollSuccess.pug
workshopDetails.pug

routes/
artwork.js
user.js
workshop.js
artists.js

controllers/
artistController.js
artworkController.js
userController.js
workshopController.js

middleware/
auth.js


##Installation and Initialization

Prerequisites:
Node.js and npm:

Node:
Ensure Node.js and npm are installed on your machine.

MongoDB:
Install MongoDB on your machine if not already installed.

Installation Steps:

Unzip zip file

cd a5

Install Dependencies:

npm install

Database Initialization:

Ensure that your MongoDB server is running.
Run the initialization script to populate the database with artwork data:

node database-init.js


##Run the Application

npm start

##Access the Application

Open your web browser and go to http://localhost:3000


##Overall Design of the Web Application

The overall design of the web application prioritizes scalability, responsiveness, and maintainability.
Architectural choices, such as adopting the MVC pattern and asynchronous programming, contribute to the success of the project.
The inclusion of extra functionality enhances user engagement and provides a more dynamic user experience.
The design decisions aim to strike a balance between simplicity, security, and user satisfaction.
The web application follows an effective use of RESTful design principles, use of proper HTTP status codes, error handling, traditional Model-View-Controller (MVC) architecture, utilizing the Express.js framework for the backend and Pug for the frontend (view).
MongoDB is used as the database to store user data, artwork information, and other relevant data.


##Design decisions

The design decision made for this project was the use of MVC. 
Model-view-Controller as an intermediary between the model and the view, facilitating communication and delivering functionality and responses.
When an end user initiates a request, the controller, intricately connected to the database, intercepts, and processes the submission.
There are many advantages of using MVC for the RESTFUL API. Those advantages are separations of concerns, using MVC separates the application's three components, making the code easier to read and a lot more organized.
It creates better testability, when trying to debug or find a mistake in the code, it is a lot easier to find it. 
MVC improves scalability, Implementing the MVC architecture in the Express.js framework for a RESTful API enables seamless horizontal scalability, allowing the application to efficiently expand by incorporating additional servers.
And finally, The MVC architecture offers considerable flexibility in designing and developing applications. Developers have the freedom to select various frameworks and libraries for each component based on their specific requirements and preferences.
Here is a link for information on MVC: https://www.scaler.com/topics/expressjs-tutorial/creating-mvc-architecture-for-restful-api/?fbclid=IwAR3zW5ucB_SughEZNzkeWlKzEZWo6vmN_5HbMiTrENdj6NZthp2xUhYJuOc 


##Conclusion

In conclusion, the web application emerges as a dynamic hub uniting artists and patrons in a vibrant online community.
With a database housing a diverse array of artworks, the platform caters to patrons by providing an engaging space for exploration, interaction, and workshop participation.
Simultaneously, artists benefit from specialized features, enabling them to showcase their creations and host workshops.
The application, designed with distinct functionalities for artists and patrons, succeeds in fostering a collaborative and inclusive digital environment, democratizing art and strengthening connections within the artistic community.
