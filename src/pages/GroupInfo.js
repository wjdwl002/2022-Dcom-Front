import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getGroupInfo,
    kickoutGroup,
    deleteGroup,
    requestList,
    registerMember,
} from '../store/group';
import styled from 'styled-components';
import { PageDiv } from '../components/Styled/PageDiv';
import { AuthContext } from '../Context/auth';
import FriendsProfile from '../components/FriendsProfile';
import { Box } from '../components/Styled/Box';
import RequestGroupProfile from '../components/RequestGroupProfile';

const GroupInfo = () => {
    const { id } = useParams();
    const auth = useContext(AuthContext);
    const [groupinfo, setGroupInfo] = useState({
        //dummy
        name: '(스터디이름)',
        users: [auth.user],
    });
    const [isRequest, setIsRequest] = useState(false);
    const [requestGroupList, setRequestGroupList] = useState([
        {
            //dummy
            id: 3,
            motto: '.......',
            name: '혜미',
            nickname: '혜미........',
            profileImage:
                'https://images.mypetlife.co.kr/content/uploads/2021/10/19151330/corgi-g1a1774f95_1280-1024x682.jpg',
        },
    ]);
    useEffect(async () => {
        await getGroupInfo(parseInt(id))
            .then((res) => setGroupInfo(res.data))
            .catch((e) => console.log(e));
    }, []);
    //멤버를 그룹에서 강퇴시킵니다
    const onKickoutHandler = async (targetGroupId, targetUserId) => {
        if (confirm('❗해당 멤버를 정말 강퇴하시겠습니까?')) {
            await kickoutGroup(targetGroupId, targetUserId);
            alert('강퇴 성공!');
        } else {
            return;
        }
    };
    //해당 그룹을 삭제합니다
    const onDeleteHandler = async () => {
        if (confirm('❗해당 그룹을 정말 삭제하시겠습니까?')) {
            await deleteGroup(id).then((r) => alert('삭제 성공!'));
        } else {
            return;
        }
    };
    //그룹 가입 요청을 한 유저 목록을 불러옵니다
    const onRequestHandler = async () => {
        await requestList(id)
            .then((r) => {
                setRequestGroupList(r.data);
                setIsRequest(!isRequest);
            })
            .catch((e) => setIsRequest(!isRequest));
    };

    const onClick = () => {
        setIsRequest(!isRequest);
    };
    return (
        <PageDiv>
            <h1 className="groupList-header">
                <a
                    style={{
                        color: '#ffc83d',
                        fontSize: 'min(6vw, 40px)',
                    }}
                >
                    {groupinfo.name}
                </a>
            </h1>
            {!isRequest ? (
                <>
                    <div style={{ display: 'flex' }}>
                        <button onClick={onDeleteHandler}>그룹 삭제하기</button>
                        <button onClick={onRequestHandler}>
                            그룹 가입신청 목록
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/*      @ts-ignore
                             실제로는 idx !== 0이 되어야함 */}
                        {groupinfo.users.map(
                            (user, idx) =>
                                idx !== 1 && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <FriendsProfile
                                            key={user.id}
                                            user={user}
                                        />
                                        <button
                                            className="light"
                                            onClick={() => {
                                                onKickoutHandler(id, user.id);
                                            }}
                                        >
                                            강퇴하기
                                        </button>
                                    </div>
                                )
                        )}
                    </div>
                </>
            ) : (
                <>
                    <button onClick={onClick}>그룹 관리 페이지로 돌아가기</button>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {requestGroupList.map((user, idx) => (
                            <RequestGroupProfile
                                id={id}
                                key={idx}
                                user={user}
                                message={'그룹가입'}
                            />
                        ))}
                    </div>
                </>
            )}
        </PageDiv>
    );
};

export default GroupInfo;