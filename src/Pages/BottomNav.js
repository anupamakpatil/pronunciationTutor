import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Practice from './Practice';
import Challenge from './Challenge';
import Profile from './Profile';
import NormalPractice from './NormalPractice';
import FreePractice from './FreePractice';
import UserPractice from './UserPractice';
import CustomPractice from './CustomPractice';
import Record from './Record';
import Reiterate from './Reiterate';
import EditProfile from './EditProfile';

const PracticeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab =createBottomTabNavigator();

// const screenOptions = {
//     tabBarShowLabel:false,
//     headerShown:false,
//     tabBarStyle:{
//       position: "absolute",
//       bottom: 0,
//       right: 0,
//       left: 0,
//       elevation: 0,
//       height: 60,
//       background: "#fff"
//     }
// }

const BottomNav = () => {

    return (
    <Tab.Navigator initialRouteName="Home" activeColor="#fff">
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
                tabBarLabel: 'Home',
                tabBarColor: '#FF6347',
                tabBarIcon: ({color}) => (
                    <Ionicons name="ios-home" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="Practice"
            component={PracticeStackScreen}
            options={{
                tabBarLabel: 'Practice',
                tabBarColor: '#1f65ff',
                tabBarIcon: ({color}) => (
                    <Ionicons name="ios-list" color={color} size={26} />
                ),
            }}
        />
        {/* <Tab.Screen
            name="Challenge"
            component={Challenge}
            options={{
                tabBarLabel: 'Challenge',
                tabBarColor: '#d02860',
                tabBarIcon: ({color}) => (
                    <Ionicons name="ios-trophy" color={color} size={26} />
                ),
            }}
        /> */}
        <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
                tabBarLabel: 'Profile',
                tabBarColor: '#1f65ff',
                tabBarIcon: ({color}) => (
                    <Ionicons name="ios-person" color={color} size={26} />
                ),
            }}
        />
    </Tab.Navigator>
    );
}

export default BottomNav;

const PracticeStackScreen = ({navigation}) => {
    return (
        <PracticeStack.Navigator>
           <PracticeStack.Screen options={{headerShown: false}} name="Practicek" component={Practice} />
           <PracticeStack.Screen name="PracticeScreen" component={NormalPractice} />
           <PracticeStack.Screen name="FreePractice" component={FreePractice} />
           <PracticeStack.Screen name="CustomWordPractice" component={CustomPractice} />
           <PracticeStack.Screen name="UserSpecificPractice" component={UserPractice} />
           <PracticeStack.Screen name="Record" component={Record} />
           <PracticeStack.Screen name="Reiterate" component={Reiterate} />
        </PracticeStack.Navigator>
    )
}

const ProfileStackScreen = ({navigation}) => {
    return (
        <ProfileStack.Navigator>
           <ProfileStack.Screen options={{headerShown: false}} name="Profilek" component={Profile} />
           <ProfileStack.Screen name="EditProfile" component={EditProfile} />
        </ProfileStack.Navigator>
    )
}