let studentArray = [];

window.addEventListener("DOMContentLoaded", () => {
    let savedData = localStorage.getItem("registeredStudents");
    if (savedData) {
        let parsedStudents = JSON.parse(savedData);
        studentArray = parsedStudents;
        renderDashboard(parsedStudents);
    }
});

function validateForm(event) {
    let firstName = document.getElementById("firstname").value.trim();
    let sirName = document.getElementById("sir_name").value.trim();
    let mobileNo = document.getElementById("user_no").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let errorBox = document.getElementById("error-msg");

    errorBox.innerHTML = "";
    document.querySelectorAll("input[type='text'], input[type='password']").forEach(input => input.classList.remove("invalid-input"));

    if (firstName.length === 0 || mobileNo.length === 0 || email.length === 0 || password.length === 0) {
        alert("All fields must be filled out!");
        errorBox.innerHTML = "!!!!!! All fields must be filled out, gng!";
        highlightFields(["firstname", "sir_name",  "user_no", "email", "password"]);
        event.preventDefault();
        return false;
    }

    let numericMobile = Number(mobileNo);
    if (mobileNo.length !== 10 || isNaN(numericMobile)) {
        alert("Mobile No must be exactly a 10-digit number!");
        errorBox.innerHTML = "Mobile No must be exactly a 10-digit number!";
        highlightFields(["user_no"]);
        event.preventDefault();
        return false;
    }

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        alert("Invalid email format! Missing '@' or '.'");
        errorBox.innerHTML = "!!!!! Invalid email format! Missing '@' or '.'";
        highlightFields(["email"]);
        event.preventDefault();
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long!");
        errorBox.innerHTML = "Password must be at least 8 char PICK acters long!";
        highlightFields(["password"]);
        event.preventDefault();
        return false;
    }

    let carChoices = document.querySelectorAll('input[name="car_choice"]:checked');
    if (carChoices.length === 0) {
        alert("GOTTA LEAST PICK ONE KINDA SLAB for slidin!");
        errorBox.innerHTML = "ova here cabron";
        event.preventDefault();
        return false;
    }

    let selectedCars = [];
    carChoices.forEach(car => selectedCars.push(car.value));

    event.preventDefault(); 

    let studentObj = {
        firstName: firstName,
        sirName: sirName,
        mobile: mobileNo,
        email: email,
        cars: selectedCars
    };

    studentArray.push(studentObj);

    let jsonStringData = JSON.stringify(studentArray);

    let fetchRecordsPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve(jsonStringData); 
        }, 500);
    });

    fetchRecordsPromise
        .then((jsonData) => {
            // Save data permanently into browser storage
            localStorage.setItem("registeredStudents", jsonData);

            let parsedStudents = JSON.parse(jsonData);
            renderDashboard(parsedStudents);

            console.log("Parsed Student Registrations:", parsedStudents);
            document.getElementById("driftForm").reset();
        })
        .catch((error) => {
            console.error("Error processing records:", error);
        });

    return false; 
}

function renderDashboard(parsedStudents) {
    let htmlOutput = "<h3>Registered  Dashboard:</h3><ul>";
    parsedStudents.forEach((student, index) => {
        htmlOutput += `<li><strong>[#${index + 1}]</strong>: ${student.firstName} ${student.sirName} (${student.email}) | Cars: ${student.cars.join(", ")}</li>`;
    });
    htmlOutput += "</ul>";

    let displayArea = document.getElementById("user-display-area");
    if (displayArea) {
        displayArea.innerHTML = htmlOutput;
    }
}

function highlightFields(fieldIds) {
    for (let i = 0; i < fieldIds.length; i++) {
        let el = document.getElementById(fieldIds[i]);
        if (el) el.classList.add("invalid-input");
    }
}