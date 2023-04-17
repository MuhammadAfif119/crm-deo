import React from 'react'

function AnalyticsTwitter({ data, platform }) {

    const { followersCount, favoritesCount, tweetCount } = data;
    const engagementCount = favoritesCount + tweetCount;
    const brandAwarenessCount = followersCount * engagementCount;

    return (
        <div>
            <p>Followers Count: {followersCount}</p>
            <p>Engagement Count: {engagementCount}</p>
            <p>Brand Awareness Count: {brandAwarenessCount}</p>
        </div>
    )
}

export default AnalyticsTwitter