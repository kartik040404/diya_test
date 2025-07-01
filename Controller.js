import Class from "./models/Class.js";
import Question from "./models/Question.js";
import Test from "./models/Test.js";
import { uploadImageToCloudinary } from "./utils/imageUploader.js";
import axios from "axios";

export const createNewClass = async (req, res) => {
    try {

        const user = req.user;
        const { studentList } = req.body;

        if (!studentList || studentList.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Fill All the Details"
            })
        }

        let classObj = [];
        studentList.map((stud) => {
            classObj.push({ class: stud.Class, div: stud.Division, institute: user.userid });
        })

        const uniqueSet = new Set(classObj.map(obj => JSON.stringify(obj)));
        const classSet = [...uniqueSet].map(str => JSON.parse(str));

        classSet.map(async (c) => {
            const existingClass = await Class.findOne({ class: c.class, div: c.div, instituteid: c.institute });
            if (!existingClass) {
                const newClass = await Class.create({ class: c.class, div: c.div, instituteid: c.institute });
            }
        })

        return res.status(200).json({
            success: true,
            message: "Class Created Successfully",
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const createTest = async (req, res) => {
    try {

        const user = req.user;
        let { name, easy, medium, hard } = req.body;

        easy = parseInt(easy);
        medium = parseInt(medium);
        hard = parseInt(hard);

        // Parse questions from body
        const questions = [];
        Object.keys(req.body).forEach((key) => {
            if (key.startsWith('questions')) {
                questions.push(JSON.parse(req.body[key]));
            }
        });

        const imageLinks = {};

        // Loop over uploaded files
        if (req.files) {
            for (const key in req.files) {
                if (key.startsWith('questionImg')) {
                    const match = key.match(/questionImg(\d+)/);
                    if (match) {
                        const index = match[1];
                        const file = req.files[key];

                        // Upload to Cloudinary
                        const response = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
                        imageLinks[index] = response.secure_url;
                    }
                }
            }
        }

        // Attach image URLs to respective questions
        const finalQuestions = questions.map((q, i) => {
            if (imageLinks[i]) {
                q.questionImg = imageLinks[i];
            }
            return q;
        });

        const quesRefArr = await Promise.all(
            finalQuestions.map(async (que) => {
                const newQue = await Question.create({
                    chapter: que.Chapter,
                    correctOption: que.CorrectOption,
                    difficulty: que.Difficulty,
                    explainationEng: que.ExplainationEng,
                    explainationMarathi: que.ExplainationMarathi,
                    option1: que.Option1,
                    option1M: que.Option1M,
                    option2: que.Option2,
                    option2M: que.Option2M,
                    option3: que.Option3,
                    option3M: que.Option3M,
                    option4: que.Option4,
                    option4M: que.Option4M,
                    quesEng: que.QuestionEng,
                    quesMarathi: que.QuestionMarathi,
                    subTopic: que.SubTopic,
                    subject: que.Subject,
                    quesImg: que.questionImg
                });
                return newQue._id;
            })
        );

        const newTest = await Test.create({ instituteid: user.userid, name: name, question: quesRefArr, easy: easy, medium: medium, hard: hard });

        return res.status(200).json({
            success: true,
            message: "Test Created Successfully"
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const testList = async (req, res) => {
    try {

        const user = req.user;

        const studList = await Test.find({ instituteid: user.userid }).populate('question');

        return res.status(200).json({
            success: true,
            message: "Test List Fetched Successfully",
            data: studList
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const classDivList = async (req, res) => {
    try {

        const user = req.user;

        const studList = await Class.find({ instituteid: user.userid });

        return res.status(200).json({
            success: true,
            message: "Class List Fetched Successfully",
            data: studList
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const scheduleTest = async (req, res) => {
    try {

        const user = req.user;
        const { testid, className, div, duration, date, endDate } = req.body;

        const findTest = await Test.findOne({ _id: testid });
        if (!findTest) {
            return res.status(401).json({
                success: false,
                message: "Test Not Exists"
            })
        }

        const updateTest = await Test.findOneAndUpdate({ _id: testid }, { duration: duration, startdate: date, endDate: endDate });
        const updateClass = await Class.findOneAndUpdate({ class: className, div: div, instituteid: user.userid }, {
            $push: {
                assignedTest: updateTest._id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Exam Scheduled Successfully"
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const studTestList = async (req, res) => {
    try {

        const user = req.user;
        const className = req.params.class;
        const divisionName = req.params.div;

        let studList = await Class.findOne({ class: className, div: divisionName }).populate('assignedTest');
        studList.student = undefined;

        studList.assignedTest.map((elm) => {
            elm.question = undefined;
        })


        return res.status(200).json({
            success: true,
            message: "Student Test List Fetched Successfully",
            data: studList.assignedTest
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const testDetails = async (req, res) => {
    try {

        const user = req.user;
        const testId = req.params.id;

        let testDetails = await Test.findOne({ _id: testId });
        let details = { ...testDetails._doc };
        details.totalQuestions = testDetails.question.length;
        details.question = undefined;

        return res.status(200).json({
            success: true,
            message: "Student Test List Fetched Successfully",
            data: details
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

function shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export const startTest = async (req, res) => {
    try {

        const { testid } = req.body;
        const token = req?.cookies?.token || req?.body?.token || req?.header("Authorization")?.replace("Bearer ", "");
        

        const testDetails = await Test.findOne({ _id: testid }).populate('question');
        if (!testDetails) {
            return res.status(401).json({
                success: false,
                message: "Test Not Found"
            })
        }

        const shuffledQuestions = shuffleArray([...testDetails.question]);

        // console.log("Start Test Log: ");
        // console.log(testid, token, shuffledQuestions);

        let newSession;

        try {
            const sessionRes = await axios.post(
                process.env.EXAM_SERVICE_BASE_URL + '/exam/start/create/session',
                {
                    duration: testDetails.duration,
                    question: shuffledQuestions
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            newSession = sessionRes.data.data;

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Error While Creating New Exam Session"
            });
        }
        // const newSession = await Session.create({startDate: testDetails.date, endDate: testDetails.endDate, student: userid, question: shuffledQuestions, duration: parseInt(testDetails.duration)});

        return res.status(200).json({
            success: true,
            message: "Test Started Successfully",
            data: {
                ...newSession,
                question: shuffledQuestions
            }
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}