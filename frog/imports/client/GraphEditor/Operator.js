// @flow

import React from 'react';
import { DraggableCore } from 'react-draggable';

export default ({
  x,
  y,
  onOver,
  onLeave,
  onClick,
  selected,
  type,
  color,
  strokeColor,
  startDragging,
  onDrag,
  onStop,
  transparent,
  title
}: Object) => {
  const stroke = selected ? '#ff9900' : 'transparent';
  let icon;
  switch (type) {
    case 'social':
      icon = <People title={title} />;
      break;
    case 'product':
      icon = <Arrows title={title} />;
      break;
    case 'control':
      icon = <Control title={title} />;
      break;
    default:
      throw 'Icon type not supported';
  }

  if (transparent) {
    return (
      <svg
        x={`${x}px`}
        y={`${y}px`}
        width="60px"
        data-tip={title}
        height="60px"
        viewBox="0 0 900 900"
        xmlSpace="preserve"
        overflow="visible"
      >
        <g onMouseUp={onClick}>
          <DraggableCore
            data-tip={title}
            onStart={startDragging}
            onDrag={onDrag}
            onStop={onStop}
          >
            <circle
              cx={300}
              data-tip={title}
              cy={300}
              r={320}
              style={{ fill: 'transparent', stroke, strokeWidth: 25 }}
              transform="translate(30,30)"
              onMouseOver={onOver}
              onMouseLeave={onLeave}
            />
          </DraggableCore>
        </g>
      </svg>
    );
  }

  return (
    <svg
      data-tip={title}
      x={`${x}px`}
      y={`${y}px`}
      width="60px"
      height="60px"
      viewBox="0 0 900 900"
      xmlSpace="preserve"
      overflow="visible"
      onMouseUp={onClick}
    >
      <circle
        data-tip={title}
        cx={300}
        cy={300}
        r={290}
        style={{
          fill: color || 'white',
          stroke: strokeColor,
          strokeWidth: 30
        }}
        transform="translate(30,30)"
      />
      {icon}
    </svg>
  );
};

const People = title => (
  <path
    data-tip={title}
    transform="translate(100,90),scale(0.9)"
    d="M147.128,91.076c0-37.95,30.766-68.716,68.721-68.716c37.95,0,68.719,30.766,68.719,68.716s-30.769,68.715-68.719,68.715
    C177.894,159.792,147.128,129.026,147.128,91.076z M248.873,206.607c0.689-14.963,5.84-28.812,14.127-40.261
    c-5.816-1.218-11.827-1.865-17.995-1.865h-58.304c-6.15,0-12.153,0.642-17.939,1.845c8.819,12.232,14.094,27.171,14.18,43.343
    c10.72-5.896,23.02-9.253,36.085-9.253C229.625,200.416,239.714,202.624,248.873,206.607z M260.505,212.775
    c19.96,12.517,33.957,33.688,36.517,58.274c8.133,3.801,17.171,5.994,26.746,5.994c34.968,0,63.311-28.346,63.311-63.313
    c0-34.971-28.343-63.311-63.311-63.311C289.12,150.42,261.031,178.257,260.505,212.775z M219.026,342.411
    c34.962,0,63.307-28.354,63.307-63.311c0-34.962-28.345-63.311-63.307-63.311c-34.965,0-63.322,28.348-63.322,63.311
    C155.705,314.057,184.061,342.411,219.026,342.411z M245.882,346.72h-53.717c-44.697,0-81.069,36.369-81.069,81.072v65.703
    l0.171,1.029l4.522,1.406c42.658,13.323,79.718,17.779,110.224,17.779c59.571,0,94.114-16.987,96.242-18.074l4.231-2.141h0.449
    v-65.703C326.936,383.089,290.585,346.72,245.882,346.72z M350.638,281.364h-53.314c-0.579,21.332-9.683,40.542-24.081,54.35
    c39.732,11.815,68.802,48.657,68.802,92.178v20.245c52.629-1.938,82.963-16.846,84.961-17.851l4.232-2.152h0.449v-65.715
    C431.693,317.728,395.324,281.364,350.638,281.364z M364.889,149.069c19.961,12.519,33.957,33.691,36.511,58.277
    c8.134,3.801,17.171,5.99,26.746,5.99c34.975,0,63.316-28.342,63.316-63.304c0-34.972-28.342-63.311-63.316-63.311
    C393.503,86.717,365.416,114.56,364.889,149.069z M455.01,217.658h-53.303c-0.579,21.332-9.682,40.542-24.08,54.349
    c39.731,11.811,68.801,48.658,68.801,92.179v20.245c52.624-1.934,82.964-16.84,84.962-17.852l4.226-2.145h0.455v-65.723
    C536.077,254.024,499.708,217.658,455.01,217.658z M107.937,277.044c12.386,0,23.903-3.618,33.67-9.777
    c3.106-20.241,13.958-37.932,29.454-49.975c0.065-1.188,0.174-2.361,0.174-3.561c0-34.971-28.351-63.311-63.298-63.311
    c-34.977,0-63.316,28.339-63.316,63.311C44.621,248.704,72.959,277.044,107.937,277.044z M164.795,335.714
    c-14.331-13.742-23.404-32.847-24.072-54.055c-1.971-0.147-3.928-0.295-5.943-0.295H81.069C36.366,281.364,0,317.728,0,362.425
    v65.709l0.166,1.023l4.528,1.412c34.214,10.699,64.761,15.616,91.292,17.153v-19.837
    C95.991,384.371,125.054,347.523,164.795,335.714z"
  />
);

const Arrows = title => (
  <path
    data-tip={title}
    transform="translate(110,100),scale(1.1)"
    d="M383.904,40.45l-87.639,87.639l52.812,22.901c1.768,0.769,2.808,2.628,2.542,4.534c-0.261,1.906-1.779,3.407-3.688,3.655
    l-131.544,17.2c-1.318,0.172-2.648-0.283-3.588-1.22c-0.94-0.94-1.396-2.264-1.224-3.591L228.77,40.028
    c0.124-0.96,0.562-1.827,1.218-2.474c0.645-0.644,1.489-1.084,2.441-1.218c1.902-0.266,3.765,0.774,4.527,2.542l22.904,52.816
    L347.5,4.052c1.679-1.67,4.386-1.664,6.064,0.006l30.34,30.334C385.583,36.059,385.583,38.769,383.904,40.45z M168.788,208.795
    L37.25,225.989c-1.915,0.248-3.428,1.749-3.694,3.659c-0.266,1.902,0.769,3.759,2.542,4.527l52.819,22.904L1.271,344.719
    c-1.673,1.679-1.673,4.392,0,6.07l30.34,30.334c1.679,1.679,4.392,1.685,6.07,0.006l87.639-87.645l22.904,52.818
    c0.762,1.768,2.618,2.802,4.527,2.536c0.958-0.136,1.797-0.567,2.436-1.212c0.656-0.65,1.099-1.514,1.217-2.482l17.201-131.538
    c0.165-1.324-0.29-2.648-1.224-3.594C171.441,209.078,170.112,208.617,168.788,208.795z M290.703,259.857l52.812-22.903
    c1.768-0.757,2.803-2.619,2.536-4.517c-0.13-0.957-0.567-1.809-1.218-2.44c-0.645-0.656-1.513-1.105-2.471-1.218l-131.544-17.2
    c-1.324-0.172-2.647,0.283-3.588,1.224c-0.939,0.934-1.395,2.27-1.218,3.588l17.194,131.544c0.249,1.909,1.75,3.422,3.659,3.688
    c1.903,0.266,3.766-0.774,4.533-2.542l22.904-52.818l87.633,87.639c1.679,1.679,4.393,1.679,6.07,0l30.335-30.34
    c1.679-1.679,1.685-4.397,0.006-6.064L290.703,259.857z M88.897,125.312l-52.818,22.901c-1.768,0.762-2.802,2.622-2.536,4.522
    c0.136,0.954,0.567,1.797,1.211,2.438c0.656,0.656,1.513,1.102,2.483,1.218l131.538,17.2c1.33,0.171,2.654-0.284,3.594-1.22
    c0.934-0.94,1.389-2.27,1.217-3.591L156.393,37.238c-0.248-1.912-1.75-3.425-3.653-3.691c-1.909-0.267-3.765,0.774-4.534,2.541
    l-22.904,52.816L37.663,1.262c-1.673-1.679-4.392-1.679-6.07,0L1.259,31.602c-1.679,1.678-1.679,4.395,0,6.064L88.897,125.312z"
  />
);

const Control = title => (
  <svg x="0px" y="0px" data-tip={title} viewBox="-5 -5 50 50">
    <path
      d="M15.794,25.937h-5.552c-0.092,0-0.169-0.073-0.169-0.165v-8.7c-0.76-0.727-1.74-1.695-2.594-2.74
		c-1.03-1.286-2.22-3.043-2.244-5.255v-2.83H2.274c-0.069,0-0.127-0.036-0.156-0.097C2.091,6.09,2.102,6.022,2.143,5.97l4.993-5.905
		C7.164,0.023,7.212,0,7.261,0l0,0c0.05,0,0.099,0.023,0.128,0.064l4.953,5.876c0.047,0.029,0.074,0.082,0.074,0.136
		c0,0.099-0.082,0.179-0.172,0.17c-0.003,0-0.003,0-0.005,0H9.356v2.829c0,0.354,0.126,0.943,0.716,1.833
		c0.479,0.734,1.226,1.592,2.284,2.634c0.198,0.199,0.403,0.399,0.611,0.599c0.21-0.198,0.416-0.399,0.616-0.599
		c1.04-1.02,1.807-1.909,2.28-2.634c0.59-0.89,0.716-1.477,0.716-1.814V6.246h-2.882c-0.064,0-0.126-0.036-0.151-0.097
		c-0.03-0.06-0.02-0.127,0.02-0.18l4.976-5.905C18.579,0.023,18.625,0,18.674,0l0,0c0.053,0,0.097,0.023,0.128,0.064l4.991,5.906
		c0.043,0.053,0.054,0.12,0.027,0.18c-0.03,0.061-0.089,0.097-0.155,0.097H20.7v2.829c-0.022,2.213-1.211,3.97-2.241,5.256
		c-0.65,0.794-1.421,1.612-2.497,2.644v8.797C15.962,25.863,15.887,25.937,15.794,25.937z"
    />
  </svg>
);