// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract NtAutoAttendance {
    struct Semester {
        uint16 year;
        uint8 season;   // 0 spring, 1 autumn
    }

    string public lecture;
    string public code;
    Semester semester;
    address public instructor; // 강사 주소
    mapping(address => bool) public attendanceRecords; // 출석 기록 매핑

    modifier onlyInstructor() {
        require(msg.sender == instructor, "Only the instructor can call this function");
        _;
    }

    event AttendanceMarked(address student);

    constructor() {
        instructor = msg.sender;
    }

    // 출석을 체크하는 함수
    function markAttendance() external {
        require(!attendanceRecords[msg.sender], "Attendance already marked");

        attendanceRecords[msg.sender] = true;

        emit AttendanceMarked(msg.sender);
    }

    // 강사가 출석을 체크하는 함수
    function markAttendanceForStudent(address student) external onlyInstructor {
        require(!attendanceRecords[student], "Attendance already marked");

        attendanceRecords[student] = true;

        emit AttendanceMarked(student);
    }

    // 학생이 출석 여부를 확인하는 함수
    function isStudentPresent() external view returns (bool) {
        return attendanceRecords[msg.sender];
    }
}