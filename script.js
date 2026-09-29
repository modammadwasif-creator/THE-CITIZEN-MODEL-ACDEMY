 /* ============================================================
   TCMA - COMPLETE SHARED JAVASCRIPT
   Student Portal + Admin + Class Timetable
============================================================ */

"use strict";

/* ============================================================
   SETTINGS
============================================================ */

const ADMIN_PASSWORD = "TCMA-admin";

const TCMA_CLASSES = [
    "Play Group",
    "ECED I",
    "ECED II",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10"
];

const CATEGORY_NAMES = {
    announcements: "Announcements",
    exams: "Exams",
    results: "Results / Marks",
    attendance: "Attendance",
    achievements: "Achievements",
    homework: "Homework / Diary",
    remarks: "Teacher Remarks",
    importantDates: "Important Dates",
    notifications: "Notifications"
};

const STORAGE = {
    students: "tcmaStudents",
    updates: "tcmaClassUpdates",
    timetables: "tcma_timetables"
};


/* ============================================================
   TIMETABLE SETTINGS
============================================================ */

const TCMA_TIMETABLE_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const TCMA_TIMETABLE_PERIODS = [
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4"
];

const DEFAULT_TIMETABLE = {
    Monday: [
        "English",
        "Math",
        "Science",
        "Urdu"
    ],

    Tuesday: [
        "Math",
        "English",
        "Computer",
        "Science"
    ],

    Wednesday: [
        "Urdu",
        "Math",
        "English",
        "Science"
    ],

    Thursday: [
        "Science",
        "English",
        "Math",
        "Computer"
    ],

    Friday: [
        "English",
        "Math",
        "Urdu",
        "Activities"
    ]
};


/* ============================================================
   BASIC HELPERS
============================================================ */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function normalizeClassName(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


/* ============================================================
   STUDENT STORAGE
============================================================ */

function getStudents() {

    try {

        const data =
            localStorage.getItem(STORAGE.students);

        if (!data) {
            return [];
        }

        const students = JSON.parse(data);

        return Array.isArray(students)
            ? students
            : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function saveStudents(students) {

    localStorage.setItem(
        STORAGE.students,
        JSON.stringify(students)
    );

}


/* ============================================================
   CLASS UPDATE STORAGE
============================================================ */

function getClassUpdates() {

    try {

        const data =
            localStorage.getItem(STORAGE.updates);

        if (!data) {
            return [];
        }

        const updates = JSON.parse(data);

        return Array.isArray(updates)
            ? updates
            : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function saveClassUpdates(updates) {

    localStorage.setItem(
        STORAGE.updates,
        JSON.stringify(updates)
    );

}


/* ============================================================
   TIMETABLE STORAGE
============================================================ */

function cloneDefaultTimetable() {

    const timetable = {};

    TCMA_TIMETABLE_DAYS.forEach(day => {

        timetable[day] = [
            ...DEFAULT_TIMETABLE[day]
        ];

    });

    return timetable;

}


function getTimetables() {

    try {

        const data =
            localStorage.getItem(
                STORAGE.timetables
            );

        if (!data) {
            return {};
        }

        const timetables =
            JSON.parse(data);

        return timetables &&
            typeof timetables === "object"
            ? timetables
            : {};

    } catch (error) {

        console.error(error);

        return {};

    }

}


function saveTimetables(timetables) {

    localStorage.setItem(
        STORAGE.timetables,
        JSON.stringify(timetables)
    );

}


function ensureAllClassTimetables() {

    const timetables =
        getTimetables();

    let changed = false;

    TCMA_CLASSES.forEach(className => {

        if (
            !timetables[className] ||
            typeof timetables[className] !== "object"
        ) {

            timetables[className] =
                cloneDefaultTimetable();

            changed = true;

        }

    });

    if (changed) {
        saveTimetables(timetables);
    }

}


function getTimetableForClass(className) {

    ensureAllClassTimetables();

    const timetables =
        getTimetables();

    const foundClass =
        TCMA_CLASSES.find(item =>
            normalizeClassName(item) ===
            normalizeClassName(className)
        );

    if (!foundClass) {
        return cloneDefaultTimetable();
    }

    const timetable =
        timetables[foundClass];

    const safeTimetable = {};

    TCMA_TIMETABLE_DAYS.forEach(day => {

        safeTimetable[day] = [];

        for (
            let i = 0;
            i < TCMA_TIMETABLE_PERIODS.length;
            i++
        ) {

            safeTimetable[day][i] =
                timetable?.[day]?.[i] ||
                DEFAULT_TIMETABLE[day][i] ||
                "";

        }

    });

    return safeTimetable;

}


function saveTimetableForClass(
    className,
    timetable
) {

    const foundClass =
        TCMA_CLASSES.find(item =>
            normalizeClassName(item) ===
            normalizeClassName(className)
        );

    if (!foundClass) {
        return false;
    }

    const timetables =
        getTimetables();

    timetables[foundClass] =
        timetable;

    saveTimetables(timetables);

    return true;

}


/* ============================================================
   MENU
============================================================ */

function toggleMenu() {

    const nav =
        document.getElementById("mainNav");

    if (nav) {
        nav.classList.toggle("active");
    }

}


/* ============================================================
   MODALS
============================================================ */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
    }

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }

}


function openGalleryImage(src) {

    const modal =
        document.getElementById("galleryModal");

    const image =
        document.getElementById(
            "galleryLargeImage"
        );

    if (!modal || !image) {
        return;
    }

    image.src = src;

    modal.classList.add("active");

}


function closeGalleryImage() {

    const modal =
        document.getElementById(
            "galleryModal"
        );

    if (modal) {
        modal.classList.remove("active");
    }

}


/* ============================================================
   STUDENT ID
============================================================ */

function generateStudentID() {

    const students =
        getStudents();

    let id;

    do {

        const number =
            Math.floor(
                100000 +
                Math.random() * 900000
            );

        id = `TCMA-${number}`;

    } while (
        students.some(
            student => student.id === id
        )
    );

    return id;

}


/* ============================================================
   PHOTO
============================================================ */

function getPhoto(file) {

    return new Promise(resolve => {

        if (!file) {

            resolve("");

            return;

        }

        const reader =
            new FileReader();

        reader.onload = function () {

            resolve(reader.result);

        };

        reader.onerror = function () {

            resolve("");

        };

        reader.readAsDataURL(file);

    });

}


function defaultAvatar(name) {

    const firstLetter =
        String(name || "S")
            .trim()
            .charAt(0)
            .toUpperCase() || "S";

    return `
        <div
            style="
                width:100%;
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#e9f2fb;
                color:#1261a8;
                font-size:38px;
                font-weight:800;
            "
        >
            ${escapeHTML(firstLetter)}
        </div>
    `;

}


/* ============================================================
   CAMPUS SELECTOR
============================================================ */

function setupCampusSelector() {

    const applyFor =
        document.getElementById(
            "applyFor"
        );

    const campus =
        document.getElementById(
            "campus"
        );

    if (!applyFor || !campus) {
        return;
    }

    const campuses = [

        "Campus 1 - Kharadar Primary",

        "Campus 2 - Police Chowki",

        "Campus 3 - Moosalane",

        "Campus 4 - Punjabi Club",

        "Campus 5 - Kharadar Secondary"

    ];

    function updateCampus() {

        campus.innerHTML = `
            <option value="">
                Select Campus
            </option>
        `;

        if (
            applyFor.value ===
            "TCMA School"
        ) {

            campuses.forEach(item => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = item;

                option.textContent = item;

                campus.appendChild(option);

            });

        }

    }

    applyFor.addEventListener(
        "change",
        updateCampus
    );

    updateCampus();

}


/* ============================================================
   ADMISSION FORM
============================================================ */

function setupAdmissionForm() {

    const form =
        document.getElementById(
            "admissionForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const studentName =
                document.getElementById(
                    "studentName"
                )?.value.trim();

            const fatherName =
                document.getElementById(
                    "fatherName"
                )?.value.trim();

            const gender =
                document.getElementById(
                    "gender"
                )?.value;

            const studentClass =
                document.getElementById(
                    "studentClass"
                )?.value;

            const section =
                document.getElementById(
                    "studentSection"
                )?.value.trim();

            const applyFor =
                document.getElementById(
                    "applyFor"
                )?.value;

            const campus =
                document.getElementById(
                    "campus"
                )?.value;

            const phone =
                document.getElementById(
                    "phone"
                )?.value.trim();

            const photoFile =
                document.getElementById(
                    "studentPhoto"
                )?.files?.[0];

            const message =
                document.getElementById(
                    "message"
                )?.value.trim();

            if (!studentName || !fatherName) {

                showFormMessage(
                    "successMessage",
                    "Please enter student and father name.",
                    "error"
                );

                return;

            }

            if (
                !TCMA_CLASSES.includes(
                    studentClass
                )
            ) {

                showFormMessage(
                    "successMessage",
                    "Please select a valid TCMA class.",
                    "error"
                );

                return;

            }

            if (
                applyFor !==
                "TCMA School"
            ) {

                showFormMessage(
                    "successMessage",
                    "Please select TCMA School.",
                    "error"
                );

                return;

            }

            if (!campus) {

                showFormMessage(
                    "successMessage",
                    "Please select a campus.",
                    "error"
                );

                return;

            }

            if (
                !/^03[0-9]{9}$/.test(phone)
            ) {

                showFormMessage(
                    "successMessage",
                    "Please enter a valid Pakistani phone number like 03XXXXXXXXX.",
                    "error"
                );

                return;

            }

            const photo =
                await getPhoto(photoFile);

            const student = {

                id: generateStudentID(),

                name: studentName,

                father: fatherName,

                gender: gender,

                className: studentClass,

                section: section,

                school: "TCMA School",

                campus: campus,

                phone: phone,

                message: message,

                photo: photo,

                date:
                    new Date().toISOString(),

                announcements: [],

                exams: [],

                results: [],

                achievements: [],

                homework: [],

                remarks: [],

                importantDates: [],

                notifications: [],

                attendance: {}

            };

            const students =
                getStudents();

            students.push(student);

            saveStudents(students);

            showFormMessage(
                "successMessage",
                `Admission submitted successfully. Your Student ID is ${student.id}.`,
                "success"
            );

            form.reset();

            setupCampusSelector();

            updateStats();

            showIDCard(student);

        }
    );

}


/* ============================================================
   FORM MESSAGE
============================================================ */

function showFormMessage(
    elementId,
    message,
    type = "success"
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        "success-message show";

    if (type === "error") {

        element.style.background =
            "#fdecec";

        element.style.color =
            "#a51f1f";

    } else {

        element.style.background =
            "#e8f7ee";

        element.style.color =
            "#19703b";

    }

}


/* ============================================================
   ID CARD
============================================================ */

function showIDCard(student) {

    const card =
        document.getElementById(
            "idCard"
        );

    if (!card) {
        return;
    }

    const photoHTML =
        student.photo
            ? `
                <img
                    src="${student.photo}"
                    class="id-card-photo"
                    alt="Student Photo"
                >
            `
            : `
                <div
                    class="id-card-photo"
                >
                    ${defaultAvatar(student.name)}
                </div>
            `;

    card.innerHTML = `

        <div class="id-card">

            <div class="id-card-header">

                <img
                    src="https://i.ibb.co/mCLD2w4y/2.png"
                    alt="TCMA Logo"
                >

                <div>

                    <h3>
                        The Citizen Model Academy
                    </h3>

                    <small>
                        STUDENT ID CARD
                    </small>

                </div>

            </div>

            <div class="id-card-body">

                ${photoHTML}

                <div class="id-number">
                    ${escapeHTML(student.id)}
                </div>

                <div class="id-card-info">

                    <div>
                        <span>Student Name</span>
                        <span>
                            ${escapeHTML(student.name)}
                        </span>
                    </div>

                    <div>
                        <span>Father Name</span>
                        <span>
                            ${escapeHTML(student.father)}
                        </span>
                    </div>

                    <div>
                        <span>Class</span>
                        <span>
                            ${escapeHTML(student.className)}
                        </span>
                    </div>

                    <div>
                        <span>Section</span>
                        <span>
                            ${escapeHTML(
                                student.section || "-"
                            )}
                        </span>
                    </div>

                    <div>
                        <span>Campus</span>
                        <span>
                            ${escapeHTML(student.campus)}
                        </span>
                    </div>

                    <div>
                        <span>Phone</span>
                        <span>
                            ${escapeHTML(student.phone)}
                        </span>
                    </div>

                </div>

            </div>

        </div>

    `;

    openModal("idModal");

}


function downloadID() {

    const card =
        document.querySelector(
            "#idCard .id-card"
        );

    if (!card) {
        return;
    }

    loadHtml2Canvas()
        .then(() => {

            return html2canvas(
                card,
                {
                    scale: 2,
                    backgroundColor:
                        "#ffffff"
                }
            );

        })
        .then(canvas => {

            const link =
                document.createElement(
                    "a"
                );

            link.download =
                "TCMA-Student-ID.png";

            link.href =
                canvas.toDataURL(
                    "image/png"
                );

            link.click();

        })
        .catch(error => {

            console.error(error);

            alert(
                "Unable to download ID card right now."
            );

        });

}


function loadHtml2Canvas() {

    if (window.html2canvas) {
        return Promise.resolve();
    }

    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement(
                    "script"
                );

            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

            script.onload =
                resolve;

            script.onerror =
                reject;

            document.head.appendChild(
                script
            );

        }
    );

}


function shareID() {

    const card =
        document.querySelector(
            "#idCard .id-card"
        );

    if (!card) {
        return;
    }

    if (!navigator.share) {

        downloadID();

        return;

    }

    loadHtml2Canvas()
        .then(() => {

            return html2canvas(
                card,
                {
                    scale: 2,
                    backgroundColor:
                        "#ffffff"
                }
            );

        })
        .then(canvas => {

            canvas.toBlob(blob => {

                const file =
                    new File(
                        [blob],
                        "TCMA-Student-ID.png",
                        {
                            type:
                                "image/png"
                        }
                    );

                if (
                    navigator.canShare &&
                    !navigator.canShare({
                        files: [file]
                    })
                ) {

                    navigator.share({
                        title:
                            "TCMA Student ID Card",
                        text:
                            "TCMA Student ID Card"
                    });

                    return;

                }

                navigator.share({
                    title:
                        "TCMA Student ID Card",
                    text:
                        "TCMA Student ID Card",
                    files: [file]
                });

            });

        });

}


/* ============================================================
   STUDENT LOGIN
============================================================ */

function setupStudentLogin() {

    const form =
        document.getElementById(
            "studentLoginForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "loginStudentName"
                )?.value.trim();

            const father =
                document.getElementById(
                    "loginFatherName"
                )?.value.trim();

            const phone =
                document.getElementById(
                    "loginPhone"
                )?.value.trim();

            const students =
                getStudents();

            const student =
                students.find(item =>

                    item.name.toLowerCase() ===
                    name.toLowerCase()

                    &&

                    item.father.toLowerCase() ===
                    father.toLowerCase()

                    &&

                    item.phone === phone

                );

            const result =
                document.getElementById(
                    "studentLoginResult"
                );

            if (!student) {

                if (result) {

                    result.innerHTML = `

                        <div class="empty-state">

                            <i class="fa-solid fa-circle-exclamation"></i>

                            <p>
                                Student record not found.
                                Please check your name,
                                father name and phone.
                            </p>

                        </div>

                    `;

                }

                return;

            }

            if (result) {

                result.innerHTML = `

                    <div class="diary-card">

                        <h3>
                            ${escapeHTML(student.name)}
                        </h3>

                        <div class="diary-meta">

                            Student ID:
                            <strong>
                                ${escapeHTML(student.id)}
                            </strong>

                            <br>

                            Class:
                            ${escapeHTML(student.className)}

                        </div>

                        <button
                            class="btn btn-primary"
                            onclick="showIDCardById('${student.id}')"
                        >

                            <i class="fa-solid fa-id-card"></i>

                            Open ID Card

                        </button>

                    </div>

                `;

            }

            renderStudentProfile(
                student
            );

            loadStudentNotices(
                student
            );

            setStudentTimetableClass(
                student.className
            );

        }
    );

}


function showIDCardById(id) {

    const student =
        getStudents().find(
            item =>
                item.id === id
        );

    if (student) {
        showIDCard(student);
    }

}


/* ============================================================
   STUDENT PROFILE
============================================================ */

function renderStudentProfile(
    student
) {

    const container =
        document.getElementById(
            "studentProfileContent"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `

        <div class="diary-card">

            <h3>
                ${escapeHTML(student.name)}
            </h3>

            <div class="diary-meta">
                Student ID:
                ${escapeHTML(student.id)}
            </div>

            <div class="id-card-info">

                <div>
                    <span>Father Name</span>
                    <span>
                        ${escapeHTML(student.father)}
                    </span>
                </div>

                <div>
                    <span>Gender</span>
                    <span>
                        ${escapeHTML(student.gender)}
                    </span>
                </div>

                <div>
                    <span>Class</span>
                    <span>
                        ${escapeHTML(student.className)}
                    </span>
                </div>

                <div>
                    <span>Section</span>
                    <span>
                        ${escapeHTML(
                            student.section || "-"
                        )}
                    </span>
                </div>

                <div>
                    <span>Campus</span>
                    <span>
                        ${escapeHTML(student.campus)}
                    </span>
                </div>

                <div>
                    <span>Phone</span>
                    <span>
                        ${escapeHTML(student.phone)}
                    </span>
                </div>

            </div>

        </div>

    `;

}


/* ============================================================
   STUDENT NOTICES
============================================================ */

function loadStudentNotices(
    student
) {

    const container =
        document.getElementById(
            "studentNotices"
        );

    if (!container) {
        return;
    }

    const updates =
        getClassUpdates()
            .filter(update =>

                normalizeClassName(
                    update.className
                ) ===
                normalizeClassName(
                    student.className
                )

            )
            .filter(update =>

                update.category ===
                    "announcements"

                ||

                update.category ===
                    "notifications"

                ||

                update.category ===
                    "importantDates"

            )
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );

    if (!updates.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-bullhorn"></i>

                <p>
                    No notices available.
                </p>

            </div>

        `;

        return;

    }

    renderStudentNoticeList(
        container,
        updates
    );

}


function renderStudentNoticeList(
    container,
    updates
) {

    container.innerHTML =
        updates.map(update => `

            <div class="notice-card">

                <h3>
                    ${escapeHTML(
                        update.subject ||
                        CATEGORY_NAMES[
                            update.category
                        ]
                    )}
                </h3>

                <div class="diary-meta">

                    ${escapeHTML(update.date)}

                    ·

                    ${escapeHTML(
                        CATEGORY_NAMES[
                            update.category
                        ] ||
                        update.category
                    )}

                </div>

                <p>
                    ${escapeHTML(update.details)}
                </p>

            </div>

        `).join("");

}


/* ============================================================
   STUDENT CLASS TIMETABLE
============================================================ */

function setupStudentTimetable() {

    ensureAllClassTimetables();

    const section =
        document.getElementById(
            "timetable"
        );

    if (!section) {
        return;
    }

    section.innerHTML = `

        <div class="container">

            <div class="section-heading">

                <span>TIME TABLE</span>

                <h2>
                    Class Timetable
                </h2>

                <p>
                    Search your class to view
                    the latest timetable.
                </p>

            </div>


            <div
                class="diary-search-card"
                style="
                    margin-bottom:25px;
                    display:flex;
                    flex-wrap:wrap;
                    gap:12px;
                    align-items:end;
                "
            >

                <div
                    class="form-group"
                    style="flex:1;min-width:240px;"
                >

                    <label for="studentTimetableSearch">
                        Search / Select Class
                    </label>

                    <input
                        type="text"
                        id="studentTimetableSearch"
                        list="studentTimetableClassList"
                        placeholder="Enter class e.g. Class 7"
                        autocomplete="off"
                    >

                    <datalist
                        id="studentTimetableClassList"
                    >

                        ${TCMA_CLASSES.map(
                            className => `
                                <option value="${escapeHTML(className)}">
                            `
                        ).join("")}

                    </datalist>

                </div>


                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="searchStudentTimetable()"
                >

                    <i class="fa-solid fa-magnifying-glass"></i>

                    View Timetable

                </button>

            </div>


            <div id="studentTimetableMessage"></div>


            <div id="studentTimetableContent"></div>

        </div>

    `;

    const savedClass =
        localStorage.getItem(
            "tcmaStudentTimetableClass"
        );

    if (
        savedClass &&
        TCMA_CLASSES.includes(savedClass)
    ) {

        setStudentTimetableClass(
            savedClass
        );

    } else {

        setStudentTimetableClass(
            TCMA_CLASSES[0]
        );

    }

}


function setStudentTimetableClass(
    className
) {

    const matchedClass =
        TCMA_CLASSES.find(item =>
            normalizeClassName(item) ===
            normalizeClassName(className)
        );

    if (!matchedClass) {
        return;
    }

    const input =
        document.getElementById(
            "studentTimetableSearch"
        );

    if (input) {
        input.value = matchedClass;
    }

    localStorage.setItem(
        "tcmaStudentTimetableClass",
        matchedClass
    );

    renderStudentTimetable(
        matchedClass
    );

}


function searchStudentTimetable() {

    const input =
        document.getElementById(
            "studentTimetableSearch"
        );

    const value =
        input?.value.trim();

    const matchedClass =
        TCMA_CLASSES.find(item =>
            normalizeClassName(item) ===
            normalizeClassName(value)
        );

    const message =
        document.getElementById(
            "studentTimetableMessage"
        );

    if (!matchedClass) {

        if (message) {

            message.innerHTML = `

                <div
                    class="error-message show"
                >

                    Please enter a valid TCMA class.

                </div>

            `;

        }

        return;

    }

    if (message) {
        message.innerHTML = "";
    }

    setStudentTimetableClass(
        matchedClass
    );

}


function renderStudentTimetable(
    className
) {

    const container =
        document.getElementById(
            "studentTimetableContent"
        );

    if (!container) {
        return;
    }

    const timetable =
        getTimetableForClass(
            className
        );

    container.innerHTML = `

        <div
            class="diary-card"
            style="margin-bottom:20px;"
        >

            <h3>
                ${escapeHTML(className)}
                Timetable
            </h3>

            <div class="diary-meta">

                Current timetable for
                ${escapeHTML(className)}

            </div>

        </div>


        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Day</th>

                        ${TCMA_TIMETABLE_PERIODS.map(
                            period => `
                                <th>
                                    ${escapeHTML(period)}
                                </th>
                            `
                        ).join("")}

                    </tr>

                </thead>


                <tbody>

                    ${TCMA_TIMETABLE_DAYS.map(
                        day => `

                            <tr>

                                <td>
                                    <strong>
                                        ${escapeHTML(day)}
                                    </strong>
                                </td>

                                ${timetable[day]
                                    .map(
                                        subject => `
                                            <td>
                                                ${escapeHTML(subject)}
                                            </td>
                                        `
                                    )
                                    .join("")}

                            </tr>

                        `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


/* ============================================================
   CLASS UPDATES - STUDENT
============================================================ */

function openClassUpdates(
    className
) {

    const modal =
        document.getElementById(
            "classUpdatesModal"
        );

    const content =
        document.getElementById(
            "classUpdatesContent"
        );

    if (!modal || !content) {
        return;
    }

    content.innerHTML = `

        <div class="section-heading">

            <span>CLASS UPDATE</span>

            <h2>
                ${escapeHTML(className)}
            </h2>

            <p>
                Verify your student information
                to view updates.
            </p>

        </div>

        <form
            id="verifyClassStudentForm"
            class="portal-form"
        >

            <div class="form-group">

                <label>
                    Student Name
                </label>

                <input
                    type="text"
                    id="verifyStudentName"
                    required
                >

            </div>

            <div class="form-group">

                <label>
                    Father Name
                </label>

                <input
                    type="text"
                    id="verifyFatherName"
                    required
                >

            </div>

            <button
                type="submit"
                class="btn btn-primary"
            >

                <i class="fa-solid fa-user-check"></i>

                Verify Student

            </button>

        </form>

        <div id="verifyClassMessage"></div>

    `;

    modal.classList.add("active");

    const form =
        document.getElementById(
            "verifyClassStudentForm"
        );

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            verifyClassStudent(
                className
            );

        }
    );

}


function verifyClassStudent(
    clickedClass
) {

    const name =
        document.getElementById(
            "verifyStudentName"
        )?.value.trim();

    const father =
        document.getElementById(
            "verifyFatherName"
        )?.value.trim();

    const students =
        getStudents();

    const student =
        students.find(item =>

            item.name.toLowerCase() ===
            name.toLowerCase()

            &&

            item.father.toLowerCase() ===
            father.toLowerCase()

        );

    const message =
        document.getElementById(
            "verifyClassMessage"
        );

    if (!student) {

        if (message) {

            message.innerHTML = `

                <div class="empty-state">

                    <p>
                        Student verification failed.
                    </p>

                </div>

            `;

        }

        return;

    }

    if (
        normalizeClassName(
            student.className
        ) !==
        normalizeClassName(
            clickedClass
        )
    ) {

        if (message) {

            message.innerHTML = `

                <div class="empty-state">

                    <p>
                        This student is not registered
                        in ${escapeHTML(clickedClass)}.
                    </p>

                </div>

            `;

        }

        return;

    }

    renderVerifiedClassUpdates(
        clickedClass,
        student
    );

}


function renderVerifiedClassUpdates(
    className,
    student
) {

    const content =
        document.getElementById(
            "classUpdatesContent"
        );

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="section-heading">

            <span>VERIFIED</span>

            <h2>
                ${escapeHTML(className)}
            </h2>

            <p>
                Welcome ${escapeHTML(student.name)}.
            </p>

        </div>

        <div class="diary-search-card">

            <div class="form-group">

                <label>
                    Search Date
                </label>

                <input
                    type="date"
                    id="classUpdateDate"
                >

            </div>

            <button
                class="btn btn-primary"
                onclick="filterClassUpdates('${escapeHTML(className)}')"
            >
                Search
            </button>

            <button
                class="btn btn-outline"
                onclick="clearClassUpdateDate('${escapeHTML(className)}')"
            >
                Show All
            </button>

        </div>

        <div id="verifiedClassUpdateList"></div>

    `;

    renderClassUpdateList(
        getClassUpdates().filter(
            update =>
                normalizeClassName(
                    update.className
                ) ===
                normalizeClassName(
                    className
                )
        )
    );

}


function filterClassUpdates(
    className
) {

    const date =
        document.getElementById(
            "classUpdateDate"
        )?.value;

    let updates =
        getClassUpdates().filter(
            update =>
                normalizeClassName(
                    update.className
                ) ===
                normalizeClassName(
                    className
                )
        );

    if (date) {

        updates =
            updates.filter(
                update =>
                    update.date === date
            );

    }

    renderClassUpdateList(
        updates
    );

}


function clearClassUpdateDate(
    className
) {

    const input =
        document.getElementById(
            "classUpdateDate"
        );

    if (input) {
        input.value = "";
    }

    const updates =
        getClassUpdates().filter(
            update =>
                normalizeClassName(
                    update.className
                ) ===
                normalizeClassName(
                    className
                )
        );

    renderClassUpdateList(
        updates
    );

}


function renderClassUpdateList(
    updates
) {

    const container =
        document.getElementById(
            "verifiedClassUpdateList"
        );

    if (!container) {
        return;
    }

    updates.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );

    if (!updates.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-folder-open"></i>

                <p>
                    No class updates found.
                </p>

            </div>

        `;

        return;

    }

    container.innerHTML =
        updates.map(update => `

            <div class="update-card">

                <h3>

                    ${escapeHTML(
                        update.subject ||
                        CATEGORY_NAMES[
                            update.category
                        ] ||
                        "Class Update"
                    )}

                </h3>

                <div class="update-meta">

                    ${escapeHTML(update.date)}

                    ·

                    ${escapeHTML(
                        CATEGORY_NAMES[
                            update.category
                        ] ||
                        update.category
                    )}

                </div>

                <div class="update-details">

                    ${escapeHTML(update.details)}

                </div>

            </div>

        `).join("");

}


/* ============================================================
   ADMIN LOGIN
============================================================ */

function adminLogin() {

    const password =
        document.getElementById(
            "adminPassword"
        )?.value;

    const error =
        document.getElementById(
            "loginError"
        );

    if (
        password !==
        ADMIN_PASSWORD
    ) {

        if (error) {

            error.textContent =
                "Incorrect admin password.";

            error.classList.add(
                "show"
            );

        }

        return;

    }

    sessionStorage.setItem(
        "tcmaAdmin",
        "true"
    );

    if (error) {
        error.classList.remove(
            "show"
        );
    }

    checkAdminPage();

}


function isAdminLoggedIn() {

    return (
        sessionStorage.getItem(
            "tcmaAdmin"
        ) === "true"
    );

}


function adminLogout() {

    sessionStorage.removeItem(
        "tcmaAdmin"
    );

    location.reload();

}


/* ============================================================
   ADMIN PAGE CHECK
============================================================ */

function checkAdminPage() {

    const isAdminPage =
        location.pathname
            .toLowerCase()
            .endsWith("admin.html");

    if (!isAdminPage) {
        return;
    }

    const loginSection =
        document.getElementById(
            "adminLoginSection"
        );

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );

    if (!loginSection || !dashboard) {
        return;
    }

    if (!isAdminLoggedIn()) {

        loginSection.classList.remove(
            "hidden"
        );

        dashboard.classList.add(
            "hidden"
        );

        return;

    }

    loginSection.classList.add(
        "hidden"
    );

    dashboard.classList.remove(
        "hidden"
    );

    updateStats();

    displayStudents(
        getStudents()
    );

    renderAdminSavedUpdates();

    renderAdminDiaryResults(
        getClassUpdates().filter(
            update =>
                update.category ===
                "homework"
        )
    );

    setDefaultAdminDate();

    setupAdminTimetableManager();

}


/* ============================================================
   ADMIN STATS
============================================================ */

function updateStats() {

    const students =
        getStudents();

    const updates =
        getClassUpdates();

    const diaries =
        updates.filter(
            item =>
                item.category ===
                "homework"
        );

    const total =
        document.getElementById(
            "totalStudents"
        );

    const tcma =
        document.getElementById(
            "tcmaStudents"
        );

    const totalDiaries =
        document.getElementById(
            "totalDiaries"
        );

    const totalUpdates =
        document.getElementById(
            "totalUpdates"
        );

    if (total) {
        total.textContent =
            students.length;
    }

    if (tcma) {

        tcma.textContent =
            students.filter(
                item =>
                    item.school ===
                    "TCMA School"
            ).length;

    }

    if (totalDiaries) {
        totalDiaries.textContent =
            diaries.length;
    }

    if (totalUpdates) {
        totalUpdates.textContent =
            updates.length;
    }

}


/* ============================================================
   ADMIN CATEGORY
============================================================ */

function openAdminCategory(
    category
) {

    if (!isAdminLoggedIn()) {

        alert(
            "Please login as admin first."
        );

        return;

    }

    const editor =
        document.getElementById(
            "categoryEditorSection"
        );

    const title =
        document.getElementById(
            "selectedCategoryTitle"
        );

    const categoryInput =
        document.getElementById(
            "adminUpdateCategory"
        );

    if (
        !editor ||
        !title ||
        !categoryInput
    ) {
        return;
    }

    categoryInput.value =
        category;

    title.textContent =
        CATEGORY_NAMES[category] ||
        category;

    editor.classList.remove(
        "hidden"
    );

    editor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setDefaultAdminDate();

}


function closeCategoryEditor() {

    const editor =
        document.getElementById(
            "categoryEditorSection"
        );

    if (editor) {

        editor.classList.add(
            "hidden"
        );

    }

}


/* ============================================================
   SAVE CLASS UPDATE
============================================================ */

function saveClassUpdate() {

    if (!isAdminLoggedIn()) {

        alert(
            "Admin login required."
        );

        return;

    }

    const className =
        document.getElementById(
            "adminClassSelect"
        )?.value;

    const category =
        document.getElementById(
            "adminUpdateCategory"
        )?.value;

    const subject =
        document.getElementById(
            "adminUpdateSubject"
        )?.value
        .trim();

    const details =
        document.getElementById(
            "adminUpdateText"
        )?.value
        .trim();

    const date =
        document.getElementById(
            "adminUpdateDate"
        )?.value;

    if (
        !TCMA_CLASSES.includes(
            className
        )
    ) {

        showAdminMessage(
            "Please select a valid class.",
            "error"
        );

        return;

    }

    if (!category) {

        showAdminMessage(
            "Please select a category.",
            "error"
        );

        return;

    }

    if (!details) {

        showAdminMessage(
            "Please enter details.",
            "error"
        );

        return;

    }

    if (!date) {

        showAdminMessage(
            "Please select a date.",
            "error"
        );

        return;

    }

    const updates =
        getClassUpdates();

    const update = {

        id:
            "UPD-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),

        className,

        category,

        subject:
            subject ||
            CATEGORY_NAMES[category],

        details,

        date,

        createdAt:
            new Date().toISOString()

    };

    updates.push(update);

    saveClassUpdates(
        updates
    );

    const subjectInput =
        document.getElementById(
            "adminUpdateSubject"
        );

    const detailsInput =
        document.getElementById(
            "adminUpdateText"
        );

    if (subjectInput) {
        subjectInput.value = "";
    }

    if (detailsInput) {
        detailsInput.value = "";
    }

    showAdminMessage(
        `${CATEGORY_NAMES[category]} saved successfully for ${className} on ${date}.`,
        "success"
    );

    renderAdminSavedUpdates();

    updateStats();

    if (
        category ===
        "homework"
    ) {
        searchAdminDiary();
    }

}


function showAdminMessage(
    text,
    type = "success"
) {

    const box =
        document.getElementById(
            "adminUpdateMessage"
        );

    if (!box) {
        return;
    }

    box.innerHTML = `

        <div
            class="${
                type === "error"
                    ? "error-message show"
                    : "success-message show"
            }"
        >

            ${escapeHTML(text)}

        </div>

    `;

}


/* ============================================================
   ADMIN SAVED UPDATES
============================================================ */

function renderAdminSavedUpdates() {

    const container =
        document.getElementById(
            "adminSavedUpdates"
        );

    if (!container) {
        return;
    }

    const updates =
        getClassUpdates()
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt ||
                        b.date
                    ) -
                    new Date(
                        a.createdAt ||
                        a.date
                    )
            );

    if (!updates.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-folder-open"></i>

                <p>
                    No saved updates yet.
                </p>

            </div>

        `;

        return;

    }

    container.innerHTML =
        updates.map(update => `

            <div class="admin-item">

                <div class="admin-item-header">

                    <div>

                        <div class="admin-item-title">

                            ${escapeHTML(
                                update.subject ||
                                CATEGORY_NAMES[
                                    update.category
                                ]
                            )}

                        </div>

                        <div class="admin-item-meta">

                            ${escapeHTML(
                                update.className
                            )}

                            ·

                            ${escapeHTML(
                                update.date
                            )}

                            ·

                            ${escapeHTML(
                                CATEGORY_NAMES[
                                    update.category
                                ] ||
                                update.category
                            )}

                        </div>

                    </div>

                    <div
                        class="admin-item-actions"
                    >

                        <button
                            class="small-delete"
                            onclick="deleteClassUpdate('${update.id}')"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Remove

                        </button>

                    </div>

                </div>

                <div class="update-details">

                    ${escapeHTML(
                        update.details
                    )}

                </div>

            </div>

        `).join("");

}


function deleteClassUpdate(id) {

    if (!isAdminLoggedIn()) {
        return;
    }

    if (
        !confirm(
            "Remove this update?"
        )
    ) {
        return;
    }

    const updates =
        getClassUpdates()
            .filter(
                item =>
                    item.id !== id
            );

    saveClassUpdates(
        updates
    );

    renderAdminSavedUpdates();

    searchAdminDiary();

    updateStats();

}


/* ============================================================
   ADMIN DIARY SEARCH
============================================================ */

function searchAdminDiary() {

    const className =
        document.getElementById(
            "adminDiarySearchClass"
        )?.value;

    const date =
        document.getElementById(
            "adminDiarySearchDate"
        )?.value;

    let diaries =
        getClassUpdates().filter(
            update =>
                update.category ===
                "homework"
        );

    if (className) {

        diaries =
            diaries.filter(
                diary =>
                    normalizeClassName(
                        diary.className
                    ) ===
                    normalizeClassName(
                        className
                    )
            );

    }

    if (date) {

        diaries =
            diaries.filter(
                diary =>
                    diary.date ===
                    date
            );

    }

    renderAdminDiaryResults(
        diaries
    );

}


function showAllAdminDiaries() {

    const classInput =
        document.getElementById(
            "adminDiarySearchClass"
        );

    const dateInput =
        document.getElementById(
            "adminDiarySearchDate"
        );

    if (classInput) {
        classInput.value = "";
    }

    if (dateInput) {
        dateInput.value = "";
    }

    const diaries =
        getClassUpdates().filter(
            update =>
                update.category ===
                "homework"
        );

    renderAdminDiaryResults(
        diaries
    );

}


function renderAdminDiaryResults(
    diaries
) {

    const container =
        document.getElementById(
            "adminDiaryResults"
        );

    if (!container) {
        return;
    }

    diaries.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );

    if (!diaries.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-book-open"></i>

                <p>
                    No diary found.
                </p>

            </div>

        `;

        return;

    }

    container.innerHTML = `

        <div class="diary-result-list">

            ${diaries.map(diary => `

                <div class="admin-item">

                    <div class="admin-item-header">

                        <div>

                            <div class="admin-item-title">

                                ${escapeHTML(
                                    diary.subject ||
                                    "Daily Diary"
                                )}

                            </div>

                            <div class="admin-item-meta">

                                Class:
                                ${escapeHTML(
                                    diary.className
                                )}

                                ·

                                Date:
                                ${escapeHTML(
                                    diary.date
                                )}

                            </div>

                        </div>

                        <button
                            class="small-delete"
                            onclick="deleteClassUpdate('${diary.id}')"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Remove Diary

                        </button>

                    </div>

                    <div class="diary-details">

                        ${escapeHTML(
                            diary.details
                        )}

                    </div>

                </div>

            `).join("")}

        </div>

    `;

}


/* ============================================================
   STUDENT DIARY SEARCH
============================================================ */

function searchStudentDiary() {

    const className =
        document.getElementById(
            "studentDiaryClass"
        )?.value;

    const date =
        document.getElementById(
            "studentDiaryDate"
        )?.value;

    const container =
        document.getElementById(
            "studentDiaryResults"
        );

    if (!container) {
        return;
    }

    if (!className || !date) {

        container.innerHTML = `

            <div class="empty-state">

                <p>
                    Please select Class and Date.
                </p>

            </div>

        `;

        return;

    }

    const diaries =
        getClassUpdates()
            .filter(
                update =>
                    update.category ===
                    "homework"
            )
            .filter(
                update =>
                    normalizeClassName(
                        update.className
                    ) ===
                    normalizeClassName(
                        className
                    )
            )
            .filter(
                update =>
                    update.date ===
                    date
            );

    if (!diaries.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-book-open"></i>

                <p>
                    No diary found for
                    ${escapeHTML(className)}
                    on
                    ${escapeHTML(date)}.
                </p>

            </div>

        `;

        return;

    }

    container.innerHTML = `

        <div class="diary-result-list">

            ${diaries.map(diary => `

                <div class="diary-card">

                    <h3>

                        ${escapeHTML(
                            diary.subject ||
                            "Daily Diary"
                        )}

                    </h3>

                    <div class="diary-meta">

                        Class:
                        ${escapeHTML(
                            diary.className
                        )}

                        ·

                        Date:
                        ${escapeHTML(
                            diary.date
                        )}

                    </div>

                    <div class="diary-details">

                        ${escapeHTML(
                            diary.details
                        )}

                    </div>

                </div>

            `).join("")}

        </div>

    `;

}


/* ============================================================
   ADMIN STUDENT DATABASE
============================================================ */

function displayStudents(
    students
) {

    const table =
        document.getElementById(
            "studentTable"
        );

    if (!table) {
        return;
    }

    if (!students.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center"
                >

                    No students found.

                </td>

            </tr>

        `;

        return;

    }

    table.innerHTML =
        students.map(student => `

            <tr>

                <td>
                    <strong>
                        ${escapeHTML(
                            student.id
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        student.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.father
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.className
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.phone
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.campus
                    )}
                </td>

                <td>

                    <button
                        class="small-delete"
                        onclick="viewStudent('${student.id}')"
                    >
                        View
                    </button>

                    <button
                        class="small-delete"
                        onclick="deleteStudent('${student.id}')"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `).join("");

}


function searchStudents() {

    const query =
        document.getElementById(
            "searchStudent"
        )?.value
        .trim()
        .toLowerCase() || "";

    const students =
        getStudents();

    if (!query) {

        displayStudents(
            students
        );

        return;

    }

    const filtered =
        students.filter(
            student =>

                [
                    student.id,
                    student.name,
                    student.father,
                    student.className,
                    student.phone,
                    student.campus
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query)

        );

    displayStudents(
        filtered
    );

}


function clearStudentSearch() {

    const input =
        document.getElementById(
            "searchStudent"
        );

    if (input) {
        input.value = "";
    }

    displayStudents(
        getStudents()
    );

}


function filterStudents() {

    searchStudents();

}


function viewStudent(id) {

    const student =
        getStudents().find(
            item =>
                item.id === id
        );

    if (student) {
        showIDCard(student);
    }

}


function deleteStudent(id) {

    if (!isAdminLoggedIn()) {
        return;
    }

    if (
        !confirm(
            "Delete this student record?"
        )
    ) {
        return;
    }

    const students =
        getStudents()
            .filter(
                student =>
                    student.id !== id
            );

    saveStudents(
        students
    );

    displayStudents(
        students
    );

    updateStats();

}


function clearAllStudents() {

    if (!isAdminLoggedIn()) {
        return;
    }

    const students =
        getStudents();

    if (!students.length) {

        alert(
            "There are no student records."
        );

        return;

    }

    if (
        !confirm(
            "Are you sure you want to delete ALL student records?"
        )
    ) {
        return;
    }

    localStorage.removeItem(
        STORAGE.students
    );

    displayStudents([]);

    updateStats();

}


/* ============================================================
   ADMIN TIMETABLE MANAGER
============================================================ */

function setupAdminTimetableManager() {

    if (!isAdminLoggedIn()) {
        return;
    }

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );

    if (!dashboard) {
        return;
    }

    if (
        document.getElementById(
            "adminTimetableManager"
        )
    ) {
        return;
    }

    ensureAllClassTimetables();

    const section =
        document.createElement(
            "section"
        );

    section.id =
        "adminTimetableManager";

    section.style.marginTop =
        "30px";

    section.innerHTML = `

        <div class="section-heading">

            <span>TIME TABLE</span>

            <h2>
                Class Timetable Manager
            </h2>

            <p>
                Search a class, view its timetable,
                click Edit, change periods and save.
            </p>

        </div>


        <div
            class="diary-search-card"
            style="
                display:flex;
                flex-wrap:wrap;
                gap:12px;
                align-items:end;
                margin-bottom:25px;
            "
        >

            <div
                class="form-group"
                style="flex:1;min-width:250px;"
            >

                <label for="adminTimetableSearch">
                    Search / Select Class
                </label>

                <input
                    type="text"
                    id="adminTimetableSearch"
                    list="adminTimetableClassList"
                    placeholder="Enter class e.g. Class 7"
                    autocomplete="off"
                >

                <datalist
                    id="adminTimetableClassList"
                >

                    ${TCMA_CLASSES.map(
                        className => `
                            <option value="${escapeHTML(className)}">
                        `
                    ).join("")}

                </datalist>

            </div>


            <button
                type="button"
                class="btn btn-primary"
                onclick="searchAdminTimetable()"
            >

                <i class="fa-solid fa-magnifying-glass"></i>

                View Timetable

            </button>

        </div>


        <div
            id="adminTimetableMessage"
        ></div>


        <div
            id="adminTimetableContent"
        >

            <div class="empty-state">

                <i class="fa-solid fa-calendar-days"></i>

                <p>
                    Search a class to manage its timetable.
                </p>

            </div>

        </div>

    `;

    dashboard.appendChild(
        section
    );

}


function searchAdminTimetable() {

    if (!isAdminLoggedIn()) {

        alert(
            "Admin login required."
        );

        return;

    }

    const input =
        document.getElementById(
            "adminTimetableSearch"
        );

    const value =
        input?.value.trim();

    const matchedClass =
        TCMA_CLASSES.find(item =>
            normalizeClassName(item) ===
            normalizeClassName(value)
        );

    const message =
        document.getElementById(
            "adminTimetableMessage"
        );

    if (!matchedClass) {

        if (message) {

            message.innerHTML = `

                <div
                    class="error-message show"
                >

                    Please enter a valid TCMA class.

                </div>

            `;

        }

        return;

    }

    if (message) {
        message.innerHTML = "";
    }

    input.value =
        matchedClass;

    renderAdminTimetableView(
        matchedClass
    );

}


function renderAdminTimetableView(
    className
) {

    const container =
        document.getElementById(
            "adminTimetableContent"
        );

    if (!container) {
        return;
    }

    const timetable =
        getTimetableForClass(
            className
        );

    container.innerHTML = `

        <div
            class="diary-card"
            style="margin-bottom:20px;"
        >

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:15px;
                    align-items:center;
                    justify-content:space-between;
                "
            >

                <div>

                    <h3>
                        ${escapeHTML(className)}
                        Timetable
                    </h3>

                    <div class="diary-meta">

                        Current saved timetable

                    </div>

                </div>


                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="editAdminTimetable('${escapeHTML(className)}')"
                >

                    <i class="fa-solid fa-pen-to-square"></i>

                    Edit Timetable

                </button>

            </div>

        </div>


        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Day</th>

                        ${TCMA_TIMETABLE_PERIODS.map(
                            period => `
                                <th>
                                    ${escapeHTML(period)}
                                </th>
                            `
                        ).join("")}

                    </tr>

                </thead>


                <tbody>

                    ${TCMA_TIMETABLE_DAYS.map(
                        day => `

                            <tr>

                                <td>
                                    <strong>
                                        ${escapeHTML(day)}
                                    </strong>
                                </td>

                                ${timetable[day]
                                    .map(
                                        subject => `
                                            <td>
                                                ${escapeHTML(subject)}
                                            </td>
                                        `
                                    )
                                    .join("")}

                            </tr>

                        `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


function editAdminTimetable(
    className
) {

    if (!isAdminLoggedIn()) {

        alert(
            "Admin login required."
        );

        return;

    }

    const container =
        document.getElementById(
            "adminTimetableContent"
        );

    if (!container) {
        return;
    }

    const timetable =
        getTimetableForClass(
            className
        );

    container.innerHTML = `

        <div
            class="diary-card"
            style="margin-bottom:20px;"
        >

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:15px;
                    align-items:center;
                    justify-content:space-between;
                "
            >

                <div>

                    <h3>
                        Edit ${escapeHTML(className)}
                        Timetable
                    </h3>

                    <div class="diary-meta">

                        Change any period below and
                        click Save / Upload Timetable.

                    </div>

                </div>

            </div>

        </div>


        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Day</th>

                        ${TCMA_TIMETABLE_PERIODS.map(
                            period => `
                                <th>
                                    ${escapeHTML(period)}
                                </th>
                            `
                        ).join("")}

                    </tr>

                </thead>


                <tbody>

                    ${TCMA_TIMETABLE_DAYS.map(
                        day => {

                            const dayKey =
                                day.replace(
                                    /\s/g,
                                    ""
                                );

                            return `

                                <tr>

                                    <td>
                                        <strong>
                                            ${escapeHTML(day)}
                                        </strong>
                                    </td>

                                    ${timetable[day]
                                        .map(
                                            (
                                                subject,
                                                index
                                            ) => `

                                                <td>

                                                    <input
                                                        type="text"
                                                        id="adminTimetable${dayKey}${index + 1}"
                                                        value="${escapeHTML(subject)}"
                                                        style="
                                                            width:100%;
                                                            min-width:130px;
                                                            padding:10px;
                                                            border:1px solid #d8dee8;
                                                            border-radius:8px;
                                                        "
                                                    >

                                                </td>

                                            `
                                        )
                                        .join("")}

                                </tr>

                            `;

                        }
                    ).join("")}

                </tbody>

            </table>

        </div>


        <div
            style="
                display:flex;
                flex-wrap:wrap;
                gap:10px;
                margin-top:20px;
            "
        >

            <button
                type="button"
                class="btn btn-primary"
                onclick="saveAdminTimetable('${escapeHTML(className)}')"
            >

                <i class="fa-solid fa-cloud-arrow-up"></i>

                Save / Upload Timetable

            </button>


            <button
                type="button"
                class="btn btn-outline"
                onclick="renderAdminTimetableView('${escapeHTML(className)}')"
            >

                Cancel

            </button>


            <button
                type="button"
                class="btn btn-outline"
                onclick="resetAdminTimetable('${escapeHTML(className)}')"
            >

                <i class="fa-solid fa-rotate-left"></i>

                Reset This Class

            </button>

        </div>

    `;

}


function saveAdminTimetable(
    className
) {

    if (!isAdminLoggedIn()) {

        alert(
            "Admin login required."
        );

        return;

    }

    const timetable = {};

    TCMA_TIMETABLE_DAYS.forEach(
        day => {

            const dayKey =
                day.replace(
                    /\s/g,
                    ""
                );

            timetable[day] = [];

            for (
                let i = 1;
                i <=
                TCMA_TIMETABLE_PERIODS.length;
                i++
            ) {

                const input =
                    document.getElementById(
                        `adminTimetable${dayKey}${i}`
                    );

                timetable[day].push(
                    input
                        ? input.value.trim()
                        : ""
                );

            }

        }
    );

    saveTimetableForClass(
        className,
        timetable
    );

    const message =
        document.getElementById(
            "adminTimetableMessage"
        );

    if (message) {

        message.innerHTML = `

            <div
                class="success-message show"
            >

                Timetable for
                <strong>
                    ${escapeHTML(className)}
                </strong>
                has been saved successfully.

            </div>

        `;

    }

    renderAdminTimetableView(
        className
    );

}


function resetAdminTimetable(
    className
) {

    if (!isAdminLoggedIn()) {
        return;
    }

    if (
        !confirm(
            `Reset ${className} timetable to the default timetable?`
        )
    ) {
        return;
    }

    saveTimetableForClass(
        className,
        cloneDefaultTimetable()
    );

    const message =
        document.getElementById(
            "adminTimetableMessage"
        );

    if (message) {

        message.innerHTML = `

            <div
                class="success-message show"
            >

                ${escapeHTML(className)}
                timetable has been reset.

            </div>

        `;

    }

    renderAdminTimetableView(
        className
    );

}


/* ============================================================
   ADMIN DATE
============================================================ */

function setDefaultAdminDate() {

    const input =
        document.getElementById(
            "adminUpdateDate"
        );

    if (
        input &&
        !input.value
    ) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        input.value =
            `${year}-${month}-${day}`;

    }

}


/* ============================================================
   YEAR
============================================================ */

function setCurrentYear() {

    const year =
        document.getElementById(
            "currentYear"
        );

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}


/* ============================================================
   ESC KEY
============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        closeModal(
            "classUpdatesModal"
        );

        closeModal(
            "idModal"
        );

        closeGalleryImage();

    }
);


/* ============================================================
   CLICK OUTSIDE MODAL
============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const modals =
            document.querySelectorAll(
                ".modal-overlay"
            );

        modals.forEach(modal => {

            if (
                event.target ===
                modal
            ) {

                modal.classList.remove(
                    "active"
                );

            }

        });

    }
);


/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        ensureAllClassTimetables();

        setupCampusSelector();

        setupAdmissionForm();

        setupStudentLogin();

        setupStudentTimetable();

        checkAdminPage();

        setCurrentYear();

    }
);


/* ============================================================
   TCMA GALLERY SLIDER
============================================================ */

const tcmaGalleryImages = [

    "https://i.ibb.co/mCLD2w4y/2.png",
    "https://i.ibb.co/hxJ1QXNh/3.png",
    "https://i.ibb.co/cKKMbbx8/4.png",
    "https://i.ibb.co/DfNBGYqK/5.png",
    "https://i.ibb.co/NgCQ2k7Y/6.png",
    "https://i.ibb.co/mVVzYC7M/7.png",
    "https://i.ibb.co/d0Gd6m9v/8.png",
    "https://i.ibb.co/0RMKcmbK/9.png",
    "https://i.ibb.co/1fqnbCSF/10.png",
    "https://i.ibb.co/1fqnbCSF/10.png",
    "https://i.ibb.co/0yy7SGsq/11.png",
    "https://i.ibb.co/YFwwP590/12.png",
    "https://i.ibb.co/cKBB3Dt2/13.png",
    "https://i.ibb.co/7dzm6NXv/14.png",
    "https://i.ibb.co/R4Db6bfT/15.png",
    "https://i.ibb.co/pvv5nBkr/16.png",
    "https://i.ibb.co/N2qYyz3k/17.png",
    "https://i.ibb.co/CKHVVCmm/18.png",
    "https://i.ibb.co/Mkprfs8C/19.png",
    "https://i.ibb.co/nND7vfsn/20.png",
    "https://i.ibb.co/VpxMvY8M/21.png",
    "https://i.ibb.co/cXxftL8y/22.png",
    "https://i.ibb.co/2Y6KKSkc/23.png",
    "https://i.ibb.co/Q30BHXhC/24.png",
    "https://i.ibb.co/8njMT8nV/25.png",
    "https://i.ibb.co/s9qxL7z9/26.png",
    "https://i.ibb.co/gFTYFqpD/27.png",
    "https://i.ibb.co/BVhJNQpf/28.png",
    "https://i.ibb.co/dJc7QRVF/29.png",
    "https://i.ibb.co/jkWRnp1W/30.png",
    "https://i.ibb.co/ds3JzWJv/31.png",
    "https://i.ibb.co/ZzSk8Z1g/32.png"

];

let currentGalleryIndex = 0;


function updateGalleryImage() {

    const image =
        document.getElementById(
            "tcmaGalleryImage"
        );

    const currentNumber =
        document.getElementById(
            "galleryCurrentNumber"
        );

    const totalNumber =
        document.getElementById(
            "galleryTotalNumber"
        );

    if (!image) {
        return;
    }

    image.style.opacity = "0";

    setTimeout(() => {

        image.src =
            tcmaGalleryImages[
                currentGalleryIndex
            ];

        image.style.opacity = "1";

    }, 150);

    if (currentNumber) {

        currentNumber.textContent =
            currentGalleryIndex + 1;

    }

    if (totalNumber) {

        totalNumber.textContent =
            tcmaGalleryImages.length;

    }

}


function nextGalleryImage() {

    currentGalleryIndex++;

    if (
        currentGalleryIndex >=
        tcmaGalleryImages.length
    ) {

        currentGalleryIndex = 0;

    }

    updateGalleryImage();

}


function previousGalleryImage() {

    currentGalleryIndex--;

    if (
        currentGalleryIndex < 0
    ) {

        currentGalleryIndex =
            tcmaGalleryImages.length - 1;

    }

    updateGalleryImage();

}


document.addEventListener(
    "keydown",
    function (event) {

        const gallery =
            document.getElementById(
                "gallery"
            );

        if (!gallery) {
            return;
        }

        if (
            event.key ===
            "ArrowRight"
        ) {

            nextGalleryImage();

        }

        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousGalleryImage();

        }

    }
);


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const totalNumber =
            document.getElementById(
                "galleryTotalNumber"
            );

        if (totalNumber) {

            totalNumber.textContent =
                tcmaGalleryImages.length;

        }

    }
);














