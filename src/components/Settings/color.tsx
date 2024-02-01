import React from 'react';
import { Trigger, Typography } from '@arco-design/web-react';
import { SketchPicker } from 'react-color';
import { generate, getRgbStr } from '@arco-design/color';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from '../../store';
import useLocale from '@/utils/useLocale';
import styles from './style/color-panel.module.less';

function ColorPanel() {
  const theme =
    document.querySelector('body').getAttribute('arco-theme') || 'light';
  const settings = useSelector((state: GlobalState) => state.settings);
  const locale = useLocale();
  const themeColor = settings.themeColor;
  const list = generate(themeColor, { list: true });
  const dispatch = useDispatch();

  return (
    <div>
      <ul className={styles.ul}>
        {list.map((item, index) => (
          <li
            key={index}
            className={styles.li}
            style={{ backgroundColor: item }}
          />
        ))}
      </ul>
      <Typography.Paragraph style={{ fontSize: 12 }}>
        {locale['settings.color.tooltip']}
      </Typography.Paragraph>
    </div>
  );
}

export default ColorPanel;
