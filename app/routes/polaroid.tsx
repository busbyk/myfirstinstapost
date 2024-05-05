import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';
import Polaroid from '~/components/Polaroid';

export default function PolaroidTest() {
  const [shown, setShown] = useState(false);

  return (
    <div>
      <button onClick={() => setShown(!shown)}>Toggle</button>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {shown && (
            <m.div
              initial={{
                transform: 'translateX(-100%) rotate(-20deg)',
                opacity: 0,
              }}
              animate={{
                transform: '',
                opacity: 1,
              }}
              exit={{
                transform: 'translateX(100%) rotate(20deg)',
                opacity: 0,
              }}
            >
              <Polaroid
                media={{
                  id: '17843146981024616',
                  media_type: 'IMAGE',
                  media_url:
                    'https://scontent-sea1-1.cdninstagram.com/v/t51.2885-15/11244972_1428510037458092_8545114_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=18de74&_nc_ohc=CvNyMv-duisQ7kNvgGbkgEz&_nc_ht=scontent-sea1-1.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfDRu7HVvTVIaOGdB2_5elhhsWr3d9k_Fh_4ukPm4XJ0bA&oe=663CA830',
                  caption: 'Power outrages man',
                  timestamp: '2013-01-31T04:39:02+0000',
                  permalink: 'https://www.instagram.com/p/VIpEAmCaBZ/',
                }}
                width={400}
              />
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
