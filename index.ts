import axios from 'axios';

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    gender: string;
    age: number;
    hair: {  color:string ,
    type:string };
    address: {
        street: string;
        city: string;
        postalCode: string;
    };
}

interface HairDetails {
    color: string;
    type: string;
}


interface SummaryData {
    male: number;
    female: number;
    ageRange: string;
    hair: { [color: string]: number };
    addressUser: { [name: string]: string };
}

async function fetchData(): Promise<UserData[]> {
    try {
        const response = await axios.get('https://dummyjson.com/users');
        const users: UserData[] = response.data.users; // Assuming the users are in an array named "users" in the response
        return users;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function groupByGender(users: UserData[]): Map<string, UserData[]> {
    const groupedData = new Map<string, UserData[]>();
    users.forEach(user => {
        const { gender } = user;
        if (!gender) {
            console.warn('User gender is missing:', user);
            return; // Skip processing this user
        }
        if (!groupedData.has(gender)) {
            groupedData.set(gender, []);
        }
        groupedData.get(gender)?.push(user);
    });
    return groupedData;
}

function processUserData(users: UserData[]): SummaryData {
    const summary: SummaryData = {
        male: 0,
        female: 0,
        ageRange: 'XX-XX',
        hair: {
            Black: 0,
            Blond: 0,
            Chestnut: 0,
            Brown: 0,
            Auburn:0
            // Add other hair colors as needed
        },
        addressUser: {}
    };

    let totalAge = 0;
    let count = 0;
    users.forEach(user => {
        if (user.gender === 'male') {
            summary.male++;
        } else if (user.gender === 'female') {
            summary.female++;
        }


        totalAge += user.age;
        count++;
        const { color} = user.hair;
        summary.hair[color]++;

        const {postalCode } = user.address;
        const name = `${user.firstName}_${user.lastName}`;
        summary.addressUser[name] = `${postalCode}`;
    });

    summary.ageRange = `${Math.floor(totalAge / count)}-${Math.ceil(totalAge / count)}`;
    return summary;
}

async function main() {
    const users = await fetchData();
    if (users.length === 0) {
        console.log('No data fetched.');
        return;
    }

    // Group users by gender
    const groupedData = groupByGender(users);
    groupedData.forEach((users) => {
        const summary = processUserData(users);
        console.log(`Department:`);
        console.log(summary);
    });
}

main();
