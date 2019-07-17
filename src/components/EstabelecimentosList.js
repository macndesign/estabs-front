import React from 'react';
import PropTypes from 'prop-types';
import { distance } from '../utils';

function EstabelecimentosList(props) {
  const ests = props.estabelecimentos && props.estabelecimentos.map(est => {
    return <tr key={est.id}>
        <td>{est.cep}</td>
        <td>{est.nome}</td>
        <td>{est.logradouro}</td>
        <td>{est.numero}</td>
        <td>{est.cidade}</td>
        <td>{est.estado}</td>
        <td>{est.pais}</td>
        <td>{distance(props.lat, props.lon, est.lat, est.lon, 'K')}{' Km'}</td>
    </tr>;
  });
  return <table>
      <thead>
        <tr>
            <th>{'Cep'}</th>
            <th>{'Nome'}</th>
            <th>{'Logradouro'}</th>
            <th>{'Numero'}</th>
            <th>{'Cidade'}</th>
            <th>{'Estado'}</th>
            <th>{'Pais'}</th>
            <th>{'Distancia'}</th>
        </tr>
      </thead>
      <tbody>{ests}</tbody>
  </table>;
}

export default EstabelecimentosList;

EstabelecimentosList.propTypes = {
  estabelecimentos: PropTypes.array.isRequired
};
