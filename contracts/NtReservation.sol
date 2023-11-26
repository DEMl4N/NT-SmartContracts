// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@quant-finance/solidity-datetime/contracts/DateTime.sol";

contract NtReservation {
    string public code; // 예약물 코드
    address public owner; // 컨트랙트 소유자 주소
    mapping(uint => address) reservation;

    event roomReserved(address reserver, uint indexed time);
    event roomOpened(address reserver, uint indexed time);

    constructor(string memory _code) {
        owner = msg.sender;
        code = _code;
    }

    // 스터디룸 예약
    function reserveRoom(uint8 year, uint8 month, uint8 day, uint8 hour, uint8 period, address reserver) public returns (bool) {
        // 예약 확인 작업
        require(period <= 4, "Cannot reserve the room for over 4 hours");

        uint[4] memory reservationTable;
        for (uint8 i = 0; i < period; i++) {
            uint t =  DateTime.timestampFromDateTime(year, month, day, hour + i, 0, 0);
            require(reservation[t] == address(0), "Already reserved");
            reservationTable[i] = t; 
        }

        for (uint8 i = 0; i < period; i++) {
            emit roomReserved(reserver, reservationTable[i]);
            reservation[reservationTable[i]] = reserver;
        }

        return true;
    }

    function openRoom(address reserverID) public returns (bool) {
        uint timeTruncated = minutesAndSeconds(block.timestamp);
        require(reservation[timeTruncated] == reserverID, "false");
        emit roomOpened(reserverID, block.timestamp);

        return true;
    }

    function minutesAndSeconds(uint timestamp) public pure returns (uint truncatedTimestamp) {
        uint256 minute = (timestamp / 60) % 60;
        uint256 second = timestamp % 60;

        truncatedTimestamp = timestamp - (minute * 60) - second;
        return truncatedTimestamp;
    }
}