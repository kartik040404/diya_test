import express from "express";

import { classDivList, createNewClass, createTest, scheduleTest, startTest, studTestList, testDetails, testList } from "./Controller.js";
import {auth, isInstitute, isStudent} from "./Middleware.js";

const router = express.Router();

router.post('/newClass/create', auth, isInstitute, createNewClass);
router.post('/create', auth, isInstitute, createTest);
router.get('/fetch/testList', auth, isInstitute, testList);
router.get('/fetch/class', auth, isInstitute, classDivList);
router.post('/schedule', auth, isInstitute, scheduleTest);
router.get('/fetch/:class/:div', auth, isStudent, studTestList);
router.get('/exam/detail/:id', auth, isStudent, testDetails);
router.post('/start', auth, isStudent, startTest);


export default router;