# Blind Ranking

## Vision

Blind Ranking is an interactive streaming game in which a host ranks five
items without knowing which items will appear next.

Viewers can participate simultaneously and compare their rankings with the
host and the community after the game.

The application is designed as a multi-creator platform. Authorized creators
can manage their own content, host game sessions and moderate community
suggestions.

## Core Game Loop

1. A host selects a topic.
2. A game session with five items is created.
3. The first item is revealed.
4. Every participant assigns one of the available ranks from 1 to 5.
5. An assigned rank cannot be used again.
6. The next item is revealed without revealing future items.
7. The process continues until all five items have been ranked.
8. The final rankings are revealed and compared.

## User Types

### User

A registered user of the platform.

Users can participate in games but cannot automatically create or host games.

### Creator

An authorized user who can:

- create and manage topics
- create and manage ranking items
- start game sessions
- moderate community suggestions
- access creator-specific game statistics

Creator permissions may later be connected to subscriptions or another
monetization model.

### Participant

A participant represents somebody taking part in a specific game session.

A participant may be:

- a registered user
- a Twitch-authenticated user
- an anonymous guest

A participant therefore does not necessarily correspond to a persisted user.

## Content

### Topic

A creator-owned category used for a Blind Ranking game.

Example:

> German rappers

### Ranking Item

A statement or scenario belonging to a topic.

Example:

> You have to go to Berghain with Fler.

A topic can contain more than five ranking items. A game session selects five
of them.

## Game Session

A game session is a concrete instance of a Blind Ranking game.

It contains:

- one host
- one topic
- five selected ranking items
- multiple participants
- the current game state
- the rankings submitted by participants

All participants receive the same items in the same order.

Future items must not be exposed to clients before they are revealed.

## Realtime Multiplayer

Viewers can join an active session and play simultaneously with the host.

During a session the application may display information such as:

- number of connected participants
- number of participants who have submitted the current ranking
- number of participants who have completed the game

Individual rankings remain hidden until the appropriate reveal.

## Results

After a session, players can compare:

- host ranking
- their own ranking
- community ranking
- ranking similarity with the host
- number of participants with the exact host ranking
- distribution of ranks per item

A later version may allow participants to create a second ranking after all
items are known and compare it with their original blind ranking.

## Community Suggestions

Viewers may later submit:

- topic suggestions
- ranking item suggestions

Twitch Channel Points may be used as one mechanism for submitting suggestions.

Community-generated content is never published automatically.

Suggestions enter a moderation queue where the creator can approve or reject
them before they become usable game content.

## Creator Dashboard

Creators require a private administration area for:

- topic management
- ranking item management
- suggestion moderation
- session management
- statistics

## MVP

The first playable version includes:

- creator-owned topics
- ranking items
- creation of a game session
- five-item blind ranking
- unique ranks from 1 to 5
- joining a session
- multiple simultaneous participants
- realtime session state
- final ranking reveal

## Post-MVP

Possible later features include:

- Twitch authentication
- Twitch Channel Points
- community suggestions
- moderation tools
- advanced statistics
- blind vs informed ranking
- creator subscriptions / monetization
- custom creator branding
- OBS / streaming integrations
