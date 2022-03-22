import { Injectable } from '@angular/core';
import { RateObject } from '../model/rate-object.model';

@Injectable()

export class ValidateActionService {
    constructor() { }

    validateAction(rateObject: RateObject[], stepId: number): RateObject[] {
        rateObject[stepId].validAction = true;
        rateObject[stepId].invalidReasoning = "";
        let actionValidation: string[] = [];
        let openBrackets: number = 0;
        let closeBrackets: number = 0;

        for (let i: number = 0; i < rateObject[stepId].action.length; i++) {
            if (rateObject[stepId].action[i].action === "") {
                rateObject[stepId].action.splice(i, 1);
            }
            if (rateObject[stepId].action[i]) {
                if (rateObject[stepId].action[i].identifier === "*"
                    || rateObject[stepId].action[i].identifier === "/" || rateObject[stepId].action[i].identifier === "%") {
                    actionValidation.push("operator");
                } else if (rateObject[stepId].action[i].identifier === "+" || rateObject[stepId].action[i].identifier === "-") {
                    actionValidation.push("plusminus");
                } else if (rateObject[stepId].action[i].identifier === "(") {
                    actionValidation.push("openbracket");
                    openBrackets = openBrackets + 1;
                } else if (rateObject[stepId].action[i].identifier === ")") {
                    actionValidation.push("closebracket");
                    closeBrackets = closeBrackets + 1;
                } else {
                    actionValidation.push("number");
                }
            }
        }
        for (let i: number = 0; i < actionValidation.length; i++) {
            const currentItem = actionValidation[i];
            if (i === 0 && currentItem === "closebracket") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "A closing parentheses cannot start the action";
                break;
            } else if (currentItem === "openbracket" && (actionValidation[i + 1] == undefined || actionValidation[i + 1] == null)) { // Dilip 05/26/2020 COM-780
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An opening parentheses cannot end the action";
                break;
            } else if (currentItem === "number" && actionValidation[i + 1] === "number") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "A numeric cannot preceed a numeric";
                break;
            } else if (currentItem === "number" && actionValidation[i + 1] === "openbracket") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "A numeric cannot preceed an opening parentheses";
                break;
            } else if (currentItem === "openbracket" && actionValidation[i + 1] === "closebracket") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An opening parentheses cannot preceed a closing parentheses";
                break;
            } else if (currentItem === "openbracket" && actionValidation[i + 1] === "operator") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An opening parentheses cannot preceed an operator";
                break;
            } else if (currentItem === "closebracket" && actionValidation[i + 1] === "openbracket") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "A closing parentheses cannot preceed an opening parentheses";
                break;
            } else if (currentItem === "operator" && actionValidation[i + 1] === "closebracket") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An operator cannot preceed a closing parentheses";
                break;
            } else if (currentItem === "operator" && (actionValidation[i + 1] === "operator" || actionValidation[i + 1] === "plusminus")) {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An operator cannot preceed an operator";
                break;
            } else if (i === 0 && currentItem === "operator") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An operator cannot start the action";
                break;
            } else if (currentItem === "operator" && (actionValidation[i + 1] == undefined || actionValidation[i + 1] == null)) {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "An operator cannot end an action";
                break;
            } else if (currentItem === "closebracket" && actionValidation[i + 1] === "number") {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "A closing parentheses cannot preceed a number";
                break;
            }
            if (openBrackets !== 0 && closeBrackets == 0) {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "A closing Parentheses is needed";
            } else if (openBrackets == 0 && closeBrackets !== 0) {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "You are missing an opening Parentheses.";
            } else if ((openBrackets !== 0 && closeBrackets !== 0) && openBrackets !== closeBrackets) {
                rateObject[stepId].validAction = false;
                rateObject[stepId].invalidReasoning = "There are an uneven amount of Parentheses.";
            }
        }
        return rateObject;
    }

}
