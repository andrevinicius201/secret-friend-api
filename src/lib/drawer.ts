import { Participants } from "@prisma/client"



export function drawParticipants(participantList: Array<Participants>) {

    var participantStatus = {} 

    participantList.forEach(participant => {
        participantStatus[participant.nickname] = {
            status: "available",
            pair: null,
            participantId: participant.id
        };
    });

    let availableParticipants = participantList.map(participant => participant.nickname);

    const drawPair = (toDrawName: string) => {
        if (availableParticipants.length === 1 && availableParticipants[0] === toDrawName) {
            return false;
        }

        let validPair = false;
        while (!validPair) {
            let randomIndex = Math.floor(Math.random() * availableParticipants.length);
            let sortedName = availableParticipants[randomIndex];

            if (toDrawName !== sortedName) {
                participantStatus[toDrawName].pair = sortedName;
                availableParticipants.splice(randomIndex, 1); 
                validPair = true;
            }
        }
        return true;
    };


    for (let toDrawName in participantStatus) {
        let success = drawPair(toDrawName);
        if (!success) {
            return drawParticipants(participantList);
        }
    }

    return participantStatus;
} 