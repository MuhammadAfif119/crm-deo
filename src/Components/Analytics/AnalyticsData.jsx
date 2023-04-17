import { Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import React from 'react'
import { HiOutlineSquares2X2 } from 'react-icons/hi2';
import { MdSupervisorAccount } from 'react-icons/md';
import { TbPresentationAnalytics, TbSpeakerphone } from 'react-icons/tb';
import { NumberAcronym } from '../../Utils/NumberUtils';

function AnalyticsData({ data, platform }) {

    console.log(data, 'ini data')
    let followersCount, engagementCount, brandAwarenessCount, impressionCount;

    switch (platform) {
        case 'twitter':
            followersCount = data.followersCount;
            engagementCount = data.favoritesCount + data.tweetCount;
            brandAwarenessCount = followersCount * engagementCount;
            impressionCount = followersCount * 2.5;
            break;

        case "youtube":
            followersCount = data.subscriberCount;
            engagementCount = data.likes + data.dislikes + data.comments + data.shares;
            brandAwarenessCount = data.views;
            impressionCount = data.viewCount * data.averageViewPercentage;
            break;

        case 'facebook':
            followersCount = data.likes;
            engagementCount = data.reactions.summary.total_count + data.comments.summary.total_count + data.shares.count;
            brandAwarenessCount = followersCount * engagementCount;
            impressionCount = followersCount * 2.5;
            break;

        case 'tiktok':
            followersCount = data.followerCount;
            engagementCount = data.likeCountTotal + data.commentCountTotal + data.shareCountTotal;
            brandAwarenessCount = data.viewCountTotal;
            impressionCount = data.viewCountTotal * 2.5;
            break;

        case 'instagram':
            followersCount = data.followers_count;
            engagementCount = data.likes_count + data.comments_count;
            brandAwarenessCount = followersCount * engagementCount;
            impressionCount = followersCount * 2.5;
            break;

        default:
            followersCount = 0;
            engagementCount = 0;
            brandAwarenessCount = 0;
            impressionCount = 0;
    }

    return (
        <Stack>
            <Stack>
                
                <HStack>
                <Text fontSize={'xl'} fontWeight='bold' color={'gray.600'}>Overview</Text>
                    <Text fontSize={'md'} color='gray.500' textTransform={'capitalize'}>( {platform} most recent )</Text>
                </HStack>
            </Stack>
            <Stack alignItems={'center'} justifyContent='center'>
                <SimpleGrid columns={[1, 2, 4]} gap={5}>
                    <Stack>
                        <Stack bgColor={'white'} shadow={3} p={5} spacing={5} justifyContent='center' borderRadius='xl'>
                            <HStack>
                                <Stack bgColor={'blue.400'} borderRadius='full' alignItems={'center'} justifyContent='center' p={1}>
                                    <MdSupervisorAccount size={'20px'} color='white' />
                                </Stack>
                                <Text color={'gray.500'}>Followers</Text>
                            </HStack>
                            <Stack>
                                <Heading>{NumberAcronym(followersCount)}</Heading>
                            </Stack>

                            <Stack alignItems={'flex-end'} justifyContent='flex-end'>
                                <Text fontSize={'sm'} color='blue.400'>See Section</Text>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Stack bgColor={'white'} shadow={3} p={5} spacing={5} justifyContent='center' borderRadius='xl'>
                            <HStack>
                                <Stack bgColor={'blue.400'} borderRadius='full' alignItems={'center'} justifyContent='center' p={1}>
                                    <TbPresentationAnalytics size={'20px'} color='white' />
                                </Stack>
                                <Text color={'gray.500'}>Engagement</Text>
                            </HStack>
                            <Stack>
                                <Heading>{NumberAcronym(engagementCount)}</Heading>
                            </Stack>

                            <Stack alignItems={'flex-end'} justifyContent='flex-end'>
                                <Text fontSize={'sm'} color='blue.400'>See Section</Text>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Stack bgColor={'white'} shadow={3} p={5} spacing={5} justifyContent='center' borderRadius='xl'>
                            <HStack>
                                <Stack bgColor={'blue.400'} borderRadius='full' alignItems={'center'} justifyContent='center' p={1}>
                                    <HiOutlineSquares2X2 size={'20px'} color='white' />
                                </Stack>
                                <Text color={'gray.500'}>Brand Awarness</Text>
                            </HStack>
                            <Stack>
                                <Heading>{NumberAcronym(brandAwarenessCount)}</Heading>
                            </Stack>

                            <Stack alignItems={'flex-end'} justifyContent='flex-end'>
                                <Text fontSize={'sm'} color='blue.400'>See Section</Text>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Stack bgColor={'white'} shadow={3} p={5} spacing={5} justifyContent='center' borderRadius='xl'>
                            <HStack>
                                <Stack bgColor={'blue.400'} borderRadius='full' alignItems={'center'} justifyContent='center' p={1}>
                                    <TbSpeakerphone size={'20px'} color='white' />
                                </Stack>
                                <Text color={'gray.500'}>Impression</Text>
                            </HStack>
                            <Stack>
                                <Heading>{NumberAcronym(impressionCount)}</Heading>
                            </Stack>

                            <Stack alignItems={'flex-end'} justifyContent='flex-end'>
                                <Text fontSize={'sm'} color='blue.400'>See Section</Text>
                            </Stack>
                        </Stack>
                    </Stack>

                </SimpleGrid>
            </Stack>
        </Stack>
    )
}

export default AnalyticsData;