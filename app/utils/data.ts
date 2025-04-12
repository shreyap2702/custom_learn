import * as FileSystem from 'expo-file-system';
import { User, Topic } from '../types/data';

const DATA_DIR = `${FileSystem.documentDirectory}data/`;
const USERS_FILE = `${DATA_DIR}users.json`;

// Ensure data directory exists
async function ensureDataDirectory() {
  const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }
}

// Log file path and contents
export async function logDataStorage() {
  console.log('Data Directory:', DATA_DIR);
  console.log('Users File Path:', USERS_FILE);
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(USERS_FILE);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(USERS_FILE);
      console.log('Current Data:', content);
    } else {
      console.log('File does not exist yet');
    }
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

// Read users data
export async function readUsersData(): Promise<User[]> {
  await ensureDataDirectory();
  try {
    const fileInfo = await FileSystem.getInfoAsync(USERS_FILE);
    if (!fileInfo.exists) {
      // Create initial file if it doesn't exist
      await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify({ users: [] }));
      return [];
    }
    const content = await FileSystem.readAsStringAsync(USERS_FILE);
    return JSON.parse(content).users;
  } catch (error) {
    console.error('Error reading users data:', error);
    return [];
  }
}

// Write users data
export async function writeUsersData(users: User[]): Promise<void> {
  await ensureDataDirectory();
  try {
    await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify({ users }));
  } catch (error) {
    console.error('Error writing users data:', error);
  }
}

// Add new user
export async function addUser(user: Omit<User, 'id' | 'createdAt' | 'topics'>): Promise<User> {
  const users = await readUsersData();
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    topics: []
  };
  users.push(newUser);
  await writeUsersData(users);
  return newUser;
}

// Add new topic to user
export async function addTopicToUser(userId: string, topic: Omit<Topic, 'id' | 'createdAt' | 'resources' | 'progress'>): Promise<Topic> {
  const users = await readUsersData();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const newTopic: Topic = {
    ...topic,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    resources: {
      youtubeLinks: [],
      blogLinks: [],
      keyPoints: []
    },
    progress: {
      completedResources: [],
      notes: [],
      lastAccessed: new Date().toISOString()
    }
  };

  users[userIndex].topics.push(newTopic);
  await writeUsersData(users);
  return newTopic;
}

// Update topic resources (after Gemini API call)
export async function updateTopicResources(userId: string, topicId: string, resources: {
  youtubeLinks: string[];
  blogLinks: string[];
  keyPoints: string[];
}): Promise<void> {
  const users = await readUsersData();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const topic = user.topics.find(t => t.id === topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  topic.resources = resources;
  await writeUsersData(users);
} 