import { useCallback, useEffect, useRef, useState } from "react";
import { fetchEvents, fetchTimeline } from "@/utils/api/wedding-timeline";

function pickPrimaryEvent(events) {
  if (!Array.isArray(events) || events.length === 0) return null;
  const sorted = [...events].sort((a, b) => {
    const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bd - ad;
  });
  return sorted[0];
}

export default function useProfileData({ token, selectedEventId }) {
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [milestonesError, setMilestonesError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadMilestones = useCallback(
    async (eventId) => {
      if (!eventId || !token) return;
      if (isMountedRef.current) {
        setMilestonesLoading(true);
        setMilestonesError(null);
      }
      const { data, error } = await fetchTimeline(eventId, token);
      if (!isMountedRef.current) return;
      if (error) {
        setMilestonesError(error);
        setMilestones([]);
      } else {
        setMilestones(data?.timeline || []);
      }
      setMilestonesLoading(false);
    },
    [token]
  );

  const loadEvent = useCallback(
    async ({ loadMilestonesAfter = true } = {}) => {
      if (!token) return;
      if (isMountedRef.current) {
        setEventLoading(true);
        setEventError(null);
      }
      const { data: eventList, error } = await fetchEvents(token);
      if (!isMountedRef.current) return;
      if (error) {
        setEventError(error);
        setEvent(null);
        setEvents([]);
        setEventLoading(false);
        return;
      }
      setEvents(eventList || []);
      let chosen = null;
      if (selectedEventId && Array.isArray(eventList)) {
        chosen = eventList.find((e) => e._id === selectedEventId) || null;
      }
      if (!chosen) chosen = pickPrimaryEvent(eventList);
      setEvent(chosen);
      setEventLoading(false);
      if (loadMilestonesAfter && chosen?._id) {
        loadMilestones(chosen._id);
      } else if (loadMilestonesAfter) {
        setMilestones([]);
      }
    },
    [token, selectedEventId, loadMilestones]
  );

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const refetchMilestones = useCallback(() => {
    if (event?._id) return loadMilestones(event._id);
    return Promise.resolve();
  }, [event, loadMilestones]);

  const refetchEvent = useCallback(() => {
    return loadEvent({ loadMilestonesAfter: false });
  }, [loadEvent]);

  return {
    event,
    events,
    eventLoading,
    eventError,
    milestones,
    milestonesLoading,
    milestonesError,
    refetchMilestones,
    refetchEvent,
  };
}
