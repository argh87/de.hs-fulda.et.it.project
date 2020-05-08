package de.hsfulda.et.wbs.action.transaktion.impl;

import de.hsfulda.et.wbs.action.transaktion.AddEinkaufAction;
import de.hsfulda.et.wbs.action.transaktion.AddTransaktionAction;
import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.core.data.TransaktionData;
import de.hsfulda.et.wbs.core.dto.PositionDto;
import de.hsfulda.et.wbs.repository.ZielortRepository;
import de.hsfulda.et.wbs.service.AccessService;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Component
public class AddEinkaufActionImpl implements AddEinkaufAction {

    private final ZielortRepository zielorte;
    private final AddTransaktionAction addAction;
    private final AccessService accessService;

    public AddEinkaufActionImpl(ZielortRepository zielorte, AddTransaktionAction addAction,
            AccessService accessService) {
        this.zielorte = zielorte;
        this.addAction = addAction;
        this.accessService = accessService;
    }

    @Override
    public TransaktionData perform(WbsUser user, Long tragerId, List<PositionDto> dto) {
        return accessService.hasAccessOnTraeger(user, tragerId, () -> {
            Long wareneingangId = zielorte.findWareneingangByTraegerId(tragerId)
                    .orElseThrow(() -> new IllegalStateException(
                            "Fehler beim Bezug des Wareneingangs. Bitte wenden Sie sich an Ihren Systemadministrator."));

            Long lagerId = zielorte.findLagerByTraegerId(tragerId)
                    .orElseThrow(() -> new IllegalStateException(
                            "Fehler beim Bezug des Lagers. Bitte wenden Sie sich an Ihren Systemadministrator."));

            return addAction.perform(user, TransaktionDtoImpl.of(wareneingangId, lagerId, dto));
        });
    }
}
