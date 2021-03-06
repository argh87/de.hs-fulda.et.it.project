package de.hsfulda.et.wbs.action.groesse;

import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.core.data.GroesseData;
import de.hsfulda.et.wbs.core.dto.GroesseDto;

public interface UpdateGroesseAction {

    GroesseData perform(WbsUser user, Long id, GroesseDto groesseDto);
}
