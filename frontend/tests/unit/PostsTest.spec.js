import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import axios from "axios";
import moment from "moment";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

// jest mocks get hoisted to the top of the file, so testData does not exist yet.
// If you have to use a variable within that mock, you have to prefix it with 'mock'.
// Now mockTestData (and therefore testData) is initialized first
const mockTestData = testData

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: mockTestData
    })
}));

describe('Posts', () => {
    
    const wrapper = mount(Posts, {router, store, localVue});

    it('Correct number of posts is rendered', function () {
        const expected = testData.length
        const actual = wrapper.findAll('.post').length
        expect(actual).toEqual(expected)
    });
    
    it('Proper media type is rendered, if exists at all', function () {
        
        // Verify that correct number of posts with images are rendered
        const imagePostsRendered = wrapper.findAll('.post .post-image img')
        const postImgsInTestData = testData.filter(post => post.media !== null && post.media.type === 'image')
        expect(imagePostsRendered.length).toEqual(postImgsInTestData.length);
    
        // Verify that correct number of posts with videos are rendered
        const videoPostsRendered = wrapper.findAll('.post .post-image video')
        const postVideosInTestData = testData.filter(post => post.media !== null && post.media.type === 'video')
        expect(videoPostsRendered.length).toEqual(postVideosInTestData.length);
        
        // Verify that all the other posts don't have media
        const renderedPosts = wrapper.findAll('.post')
        const nullMediaRendered = renderedPosts.length - imagePostsRendered.length - videoPostsRendered.length
        const nullMediaInTestData = testData.filter(post => post.media === null).length
        expect(nullMediaRendered).toEqual(nullMediaInTestData);
    });
    
    it('Post create time is displayed in correct format', function () {
        // check that each test post's create time is rendered in correct format
        for (let i = 0; i < testData.length; i++) {
            const post = testData[i]
            const expectedDateString = moment(post.createTime).format('LLLL')
            expect(wrapper.html()).toContain(expectedDateString)
        }
    });
});