import React, {useEffect, useState} from 'react';
import PostService from './components/API/PostService';
import ClassCounter from './components/ClassCounter';
import PostFilter from './components/PostFilter';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Loader from './components/UI/Loader/Loader';
import MyModal from './components/UI/MyModal/MyModal';
import MyButton from './components/UI/button/MyButton';
import {getPageCount, getPagesArray} from './components/utils/pages';
import {useFetching} from './hooks/useFetching.js';
import {usePosts} from './hooks/usePosts';
import './styles/App.css';
import Pagination from './components/UI/pagination/Pagination';
function App() {
    const [posts, setPosts] = useState([
        {id: 1, title: 'Javascrupt', body: 'frontend'},
        {id: 2, title: 'Python', body: 'neural'},
        {id: 3, title: 'PHP', body: 'backend'}
    ]);
    const [selectedSort, setSelectedSort] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const changePage = (page) => {
        setPage(page);
    };
    const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
        const response = await PostService.getAll(limit, page);
        setPosts(response.data);
        const totalCount = response.headers['x-total-count'];
        setTotalPages(getPageCount(totalCount, limit));
        console.log(totalPages);
    });

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const createPost = function (newPost) {
        setPosts([...posts, newPost]);
        setModal(false);
    };

    const removePost = function (postForDelete) {
        setPosts(posts.filter((p) => p.id !== postForDelete.id));
    };

    return (
        <div className='App'>
            <button onClick={fetchPosts}>Get posts</button>
            <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
                Создать пост
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost} />
            </MyModal>
            <hr style={{margin: '15px 0'}} />
            <PostFilter filter={filter} setFilter={setFilter} />
            {postError && <h1>ОШИБКА ${postError} </h1>}
            {isPostsLoading ? (
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
                    <Loader />
                </div>
            ) : (
                <PostList posts={sortedAndSearchedPosts} remove={removePost} title='Список постов 1' />
            )}
            <Pagination page={page} changePage={changePage} totalPages={totalPages}></Pagination>
            <ClassCounter />
        </div>
    );
}

export default App;
