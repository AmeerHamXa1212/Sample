"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNull = void 0;
function validateNull(object) {
    if (!object || object.length === 0) {
        return true;
    }
    return false;
}
exports.validateNull = validateNull;
