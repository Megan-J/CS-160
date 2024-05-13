

    // This would make sense for a public profile page
    // const follow = (targetId: number) => {
    //     const userJson = sessionStorage.getItem("user") || {};
    //     fetch(`${backend}/follow_user`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: {
    //             as_id: userJson.aID,
    //             target_id: targetId
    //         }
    //     })
    //     .then(res => {
    //         if (res.ok) {
    //             const followingUpdated = following.push(target_id)
    //             setFollowing(followingUpdated)
    //         }
    //     })
    // }